import { BetBody, BetEntity } from '../../Bet/domain'
import { CurrencyEntity } from '../../Currencies/domain/currency.entity'
import { sendCredit } from './wallet-request';
import { CreditWalletRequest } from '../Interfaces/wallet.interfaces';
import { playerUseCases } from '../../Player/infraestructure/dependencies';
import { currencyUseCases } from '../../Currencies/infrastructure/dependencies';
import { getBetEarnings } from './wheel-utils';
import { roundUseCases } from '../../Round/infraestructure/dependencies';
import { betUseCases } from '../../Bet/infraestructure/dependencies';

export const calculateAmountBet = (bet: BetBody[]): number => {
    let totalAmount: number = 0
    bet.forEach(betBody => {
        totalAmount += betBody.amount
    });
    return totalAmount
}
  
export const exchangeCurrencyByDollar = (currency: CurrencyEntity): number => {
  if (!currency.exchangeRateHistory) return 0
  const lastIndex = currency.exchangeRateHistory.length - 1
  return currency.exchangeRateHistory[lastIndex].price
}

export const getSecondsOfDiferent = (date: Date) => {
  const dif = date.getTime() - new Date().getTime()
  const secondsOfDiferent = Math.abs(dif / 1000)
  return secondsOfDiferent
}

export const addHoursToTime = (date: Date, countHours: number): Date => {
  // Obten el numero de milisegundos de la fecha recibida
  const numberOfMlSeconds = date.getTime()
  // la cantidad de horas que quieras operar convierte a milisegundos
  const addMlSeconds = countHours * 60 * 60000
  // realiza la operacion
  const newObjDate = new Date(numberOfMlSeconds + addMlSeconds)
  return newObjDate
}

export const getBetsWinnerByResult = (bets: BetEntity[], result: number): BetEntity[] => {
  let betsWinner: BetEntity[] = [];

  bets.forEach(( bet : BetEntity) => {
    bet.bet.forEach( optionBet => {
      if(optionBet.number === result) {
        betsWinner.push(bet)
      }
    });
  });

  return betsWinner;
};

export const payBetsWinner = async (roundUuid: string) => {
  const round = await roundUseCases.findRoundByUuid(roundUuid);
  // const round = await roundControlRedisRepository.getRound(roundUuid);
  if(!round || !round.result) return;

  const { result } = round;

  // const bets = await betControlRedisRepository.getBetsByRound(roundUuid);
  const bets = await betUseCases.findBetsByRoundUuid(roundUuid);
  if(!bets.length) return;

  const betsWinner = getBetsWinnerByResult(bets, result);
  if(!betsWinner.length) return;

  await payWinners({ 
    bets: betsWinner,
    result,
    roundId: roundUuid 
  });

//   Redis.del(`round:${round.uuid}`)
//   Redis.del(`bets:${round.uuid}`)
}

export const payWinners = async (
  { bets, result, roundId }:
  { bets: BetEntity[], result: number, roundId: string }
) => {
  for (let i = 0; i < bets.length; i++) {
    const bet = bets[i];

    const player = await playerUseCases.findByUuid(bet.playerUuid);
    if(!player) return;

    const currency = await currencyUseCases.getCurrencyByUuid(bet.currencyUuid);
    if(!currency) return;

    const earnings = getBetEarnings(bet, result);
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
      currency: currency.isoCode,
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