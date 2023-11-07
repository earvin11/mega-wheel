import { BetEntity } from 'App/Bet/domain'
import { initialPayments } from 'App/Bet/domain/Number'
import { WheelFortuneEntity } from 'App/WheelFortune/domain/wheel-fortune.entity'

export const useWinnerFilter = (result: number) => {
  return { 'bet.number': result }
}

export const getBetEarnings = (
  wheelFortune: WheelFortuneEntity,
  bet: BetEntity,
  result: number,
) => {
  const { bet: betData } = bet
  const winnerNumber = betData.find((b) => b.number === result)
  const payment = initialPayments.find((b) => b.number === result)
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
