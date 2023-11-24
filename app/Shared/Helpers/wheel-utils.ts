import Redis from '@ioc:Adonis/Addons/Redis'
import { BetEntity } from '../../Bet/domain'
import { CurrencyEntity } from '../../Currencies/domain/currency.entity'
import { playerUseCases } from '../../Player/infraestructure/dependencies'
import { RoundBet } from '../../RoundBets/domain/round-bet.value'
import { CreditWalletRequest } from '../Interfaces/wallet.interfaces'
import { sendCredit } from './wallet-request'
import { betControlRedisRepository } from '../../Bet/infraestructure/dependencies'
import { roundControlRedisRepository, roundUseCases } from '../../Round/infraestructure/dependencies'
import { currencyUseCases } from 'App/Currencies/infrastructure/dependencies'
import { initialPayments, multisAllowed } from 'App/Bet/domain/Number'
import { RoundBetEntity } from 'App/RoundBets/domain/roundBet.entity'
import { WheelFortuneEntity } from 'App/WheelFortune/domain/wheel-fortune.entity'
import { randomNumber } from './randomNumber'
// import { WheelFortuneEntity } from 'App/WheelFortune/domain/wheel-fortune.entity'

interface Analysis {
  number: number
  amount: number
}

export const useWinnerFilter = (result: number) => {
  return { 'bet.number': result }
}

export const getBetEarnings = (
  // wheelFortune: WheelFortuneEntity,
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
interface CompleteAnalisys {
  number: number
  naturalPay: number
  mult: number
  payWithMul: number
  percentEarning: number
  percentReturnToPlayer: number
}
export const useAnalisysPosible = (roundBet: RoundBetEntity): CompleteAnalisys[] => {
  const { numbers, totalAmount } = roundBet

  const completeAnalisys: CompleteAnalisys[] = []

  for (let i = 0; i < numbers.length; i++) {
    const currentNumber = numbers[i]
    const { amount, number } = currentNumber

    multisAllowed.forEach((mult) => {
      const analysisObject = {
        number,
        naturalPay: amount * (number + 1),
      }
      const payWithMul = amount * (mult + 1)
      const percentEarning = ((totalAmount - payWithMul) / totalAmount) * 100
      const percentReturnToPlayer = 100 - percentEarning
      if (mult > number) {
        Object.assign(analysisObject, {
          mult,
          payWithMul,
          percentEarning,
          percentReturnToPlayer,
        })
        completeAnalisys.push(analysisObject as CompleteAnalisys)
      }
    })
  }

  return completeAnalisys
}

export const useJackpotRandom = (
  completeAnalisys: CompleteAnalisys[],
  percentReturnToPlayer: number,
): CompleteAnalisys => {
  const multsValid = completeAnalisys.filter(
    (c) => c.percentReturnToPlayer <= percentReturnToPlayer,
  )
  const mandatoryMult = completeAnalisys.sort(
    (a: CompleteAnalisys, b: CompleteAnalisys) => a.percentReturnToPlayer - b.percentReturnToPlayer,
  )[0]

  if (!multsValid.length) {
    return mandatoryMult
  }
  return multsValid[randomNumber(0, multsValid.length - 1)]
}

export const useJackpot = (
  completeAnalisys: CompleteAnalisys[],
  percentReturnToPlayer: number,
): CompleteAnalisys => {
  const multsValid = completeAnalisys
    .filter((c) => c.percentReturnToPlayer <= percentReturnToPlayer)
    .sort(
      (a: CompleteAnalisys, b: CompleteAnalisys) =>
        a.percentReturnToPlayer - b.percentReturnToPlayer,
    )
  const mandatoryMult = completeAnalisys.sort(
    (a: CompleteAnalisys, b: CompleteAnalisys) => a.percentReturnToPlayer - b.percentReturnToPlayer,
  )[0]

  if (!multsValid.length) {
    return mandatoryMult
  }
  return multsValid[0]
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

  const bets = await betControlRedisRepository.getBetsByRound(roundUuid);
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
