import { BetEntity } from "../../Bet/domain";
import { CreditWalletRequest } from "../Interfaces/wallet.interfaces";
import axios from "axios";
import RoundModel from "../../Round/infraestructure/round.model";
import BetModel from "../../Bet/infraestructure/bet.model";
import PlayerModel from "../../Player/infraestructure/player.model";
// import CurrencyModel from "../../Currencies/infrastructure/currency.model";
import { WheelFortuneEntity } from "App/WheelFortune/domain/wheel-fortune.entity";
import GameModel from "../../WheelFortune/infraestructure/wheelFortune.model";

const getBetEarnings = (
    wheelFortune: WheelFortuneEntity,
    bet: BetEntity,
    result: number,
  ) => {
    const { bet: betData } = bet
    const winnerNumber = betData.find((b) => b.number === result)
    const payment = wheelFortune.betPays.find((b) => b.number === result)
    if (!winnerNumber || !payment) {
      console.log('winner or payment  no encontrado')
      return
    }
  
    return {
      amountOriginal: winnerNumber.amount,
      bet: winnerNumber.number,
      earning: payment.multiplier * winnerNumber.amount,
    }
  }

const sendCredit = async(endpointWin: string, data: CreditWalletRequest) => {
    try {
        const creditWallet = await axios({
            method: 'POST',
            url: endpointWin,
            data,
            validateStatus: function (status) {
                return status < 500;
            },
        });
        return creditWallet;
    } catch (error) {
        console.log("SENDBET ENDPOINTBET -> UTILS", error);
        throw error;
    }
};

export const getBetsWinnerByResult = async (roundUuid: string, result: number): Promise<BetEntity[] | []> => {
    const betsWinner = await BetModel.find({ roundUuid, 'bet.number': { $in: result } })
    if(!betsWinner) return [];
    return betsWinner;
};
  
export const payBetsWinnerWorker = async (roundUuid: string) => {
    const round = await RoundModel.findOne({ uuid: roundUuid });
    if(!round || !round.result) return;

    const { result } = round;

    const betsWinner = await getBetsWinnerByResult(roundUuid, result);
    if(!betsWinner.length) return;

    await payWinners({ 
        bets: betsWinner,
        result,
        roundId: roundUuid 
    });
}

export const payWinners = async (
    { bets, result, roundId }:
    { bets: BetEntity[], result: number, roundId: string }
    ) => {
    for (let i = 0; i < bets.length; i++) {
        const bet = bets[i];

        const player = await PlayerModel.findOne({ uuid: bet.playerUuid });
        if(!player) return;

        // //TODO:
        // const currency = await CurrencyModel.findOne({ uuid: bet.currencyUuid });
        // if(!currency) return;

        const wheel = await GameModel.findOne({ uuid: bet.gameUuid })
        if(!wheel) return;

        const earnings = getBetEarnings(wheel, bet, result);
        if(!earnings) return;

        const { earning } = earnings;

        const dataWalletWin: CreditWalletRequest = {
            user_id: player.userId,
            round_id: roundId,
            bet_id: String(bet._id!),
            game_id: bet.gameUuid,
            bet_code: bet.uuid!,
            bet_date: bet.createdAt!,
            amount: earning,
            transactionType: 'win',
            currency: bet.currencyIsoCode,
            platform: '',
        }
        
        try {
        const { data } = await sendCredit(player.operator.endpointWin, dataWalletWin)
            //TODO:
            console.log({ wallet: data })
            if (!data.ok) {
                // await logUseCases.createLog({
                //   typeError: TypesLogsErrors.credit,
                //   request: dataWalletWin,
                //   response: data,
                //   error: data.msg,
                //   player: bet.player,
                // })
                console.log({ wallet: 'Error in wallet', data })
            }
        } catch (error) {
            console.log('ERROR CREDITO -> ', error)
            // await logUseCases.createLog({
            //   typeError: TypesLogsErrors.credit,
            //   request: dataWalletWin,
            //   response: error,
            //   player: bet.player,
            // })
            continue
        }
    }
}