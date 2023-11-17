import { BetEntity } from 'App/Bet/domain'
import { initialPayments } from 'App/Bet/domain/Number'
import { CurrencyEntity } from 'App/Currencies/domain/currency.entity'
import { RoundBet } from 'App/RoundBets/domain/round-bet.value'
import { WheelFortuneEntity } from 'App/WheelFortune/domain/wheel-fortune.entity'

interface Analysis {
  number: number
  amount: number
}

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

export const toteBets = (bets: BetEntity[]) => {
  // TODO dolarizar amounts, maybe payments from db and not hardcode
  const totalBets: Analysis[] = []

  for (let i = 0; i < initialPayments.length; i++) {
    const currentNumber = initialPayments[i]
    let totalAmountInNumber = 0
    const betsFiltered = bets.filter((b) => b.bet.find((b) => b.number === currentNumber.number))
    if (!betsFiltered.length) {
      totalBets.push({
        number: currentNumber.number,
        amount: totalAmountInNumber,
      })
      continue
    }
    betsFiltered.forEach((b) => {
      const bet = b.bet.find((b) => b.number === currentNumber.number)
      totalAmountInNumber += bet?.amount as number
    })
    totalBets.push({
      number: currentNumber.number,
      amount: totalAmountInNumber,
    })
  }

  return totalBets
}

export const getJackpot = (analysis: Analysis[]) => {
  const sortAnalysis = analysis.sort((a: Analysis, b: Analysis) => a.amount - b.amount)

  return sortAnalysis[0]
}

export const roundBetUpdater = (
  roundBet: RoundBet,
  bets: BetEntity[],
  currencies: CurrencyEntity[],
) => {
  const auxRoundBet = roundBet
  for (let i = 0; i < bets.length; i++) {
    const currentBet = bets[i]
    const { bet, currencyUuid } = currentBet
    const filteredCurrency = currencies.find((c) => c.uuid === currencyUuid)
    if (!filteredCurrency) {
      console.log('Error currency no encontrado')
      continue
    }

    bet.forEach((b) => {
      const currentNumber = auxRoundBet.numbers.find((n) => n.number === b.number)
      if (!currentNumber) {
        console.log('Error Number bet not valid', b)
        return
      }

      const newAmount = currentNumber?.amount + b.amount * filteredCurrency.usdRateChange
      auxRoundBet.numbers[auxRoundBet.numbers.indexOf(currentNumber)].amount = newAmount
    })
  }

  return auxRoundBet
}
