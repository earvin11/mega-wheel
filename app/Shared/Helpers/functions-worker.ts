import { BetEntity } from '../../Bet/domain'
import { CreditWalletRequest } from '../Interfaces/wallet.interfaces'
import axios from 'axios'
import RoundModel from '../../Round/infraestructure/round.model'
import BetModel from '../../Bet/infraestructure/bet.model'
import PlayerModel from '../../Player/infraestructure/player.model'
// import CurrencyModel from "../../Currencies/infrastructure/currency.model";
import { WheelFortuneEntity } from 'App/WheelFortune/domain/wheel-fortune.entity'
import GameModel from '../../WheelFortune/infraestructure/wheelFortune.model'
import { logUseCases } from '../../Log/infrastructure/dependencies'
import { TypesLogsErrors } from '../../Log/domain/log.entity'
import { getBetEarnings } from './wheel-utils'
import { Jackpot } from 'App/Round/domain'
const sendCredit = async (endpointWin: string, data: CreditWalletRequest) => {
  try {
    const creditWallet = await axios({
      method: 'POST',
      url: endpointWin,
      data,
      validateStatus: function (status) {
        return status < 500
      },
    })
    return creditWallet
  } catch (error) {
    console.log('SENDBET ENDPOINTBET -> UTILS', error)
    throw error
  }
}

export const getBetsWinnerByResult = async (
  roundUuid: string,
  result: number,
): Promise<BetEntity[] | []> => {
  const betsWinner = await BetModel.find({ roundUuid, 'bet.number': { $in: result } })
  if (!betsWinner) return []
  return betsWinner
}

export const payBetsWinnerWorker = async (roundUuid: string) => {
  const round = await RoundModel.findOne({ uuid: roundUuid })
  if (!round || !round.result || !round.jackpot) return
  const { result, jackpot } = round

  const betsWinner = await getBetsWinnerByResult(roundUuid, result)
  if (!betsWinner.length) return

  payWinners({
    bets: betsWinner,
    result,
    roundId: roundUuid,
    jackpot,
  })
}

export const payWinners = async ({
  bets,
  result,
  roundId,
  jackpot,
}: {
  bets: BetEntity[]
  result: number
  roundId: string
  jackpot: Jackpot
}) => {
  for (let i = 0; i < bets.length; i++) {
    const bet = bets[i]

    const player = await PlayerModel.findOne({ uuid: bet.playerUuid })
    if (!player) return

    // //TODO:
    // const currency = await CurrencyModel.findOne({ uuid: bet.currencyUuid });
    // if(!currency) return;

    const wheel = await GameModel.findOne({ uuid: bet.gameUuid })
    if (!wheel) return

    const earnings = getBetEarnings(wheel, bet, result, jackpot)
    if (!earnings) return

    const { earning } = earnings
    console.log('earnings', earnings)
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
      if (!data.ok) {
        await logUseCases.createLog({
          typeError: TypesLogsErrors.credit,
          request: dataWalletWin,
          response: data,
          error: data.msg,
          player: bet.playerUuid,
        })
        console.log({ wallet: 'Error in wallet', data })
      }
    } catch (error) {
      console.log('ERROR CREDITO -> ', error)
      await logUseCases.createLog({
        typeError: TypesLogsErrors.credit,
        request: dataWalletWin,
        response: error,
        player: bet.playerUuid,
      })
      continue
    }
  }
}
