import { HttpContext } from '@adonisjs/core/build/standalone'
import { BetUseCases } from '../application/bet.use-cases'
import { BetEntity } from '../domain'
import { getBetEarnings, useWinnerFilter } from '../../Shared/Helpers/wheel-utils'
import { RoundUseCases } from '../../Round/application/round.use-cases'
import { WheelFortuneUseCases } from '../../WheelFortune/apllication/wheel-fortune.use-cases'
import { Jackpot } from 'App/Round/domain'

export class BetController {
  constructor(
    private betUseCases: BetUseCases,
    private roundUseCases: RoundUseCases,
    private wheelFortuneUseCases: WheelFortuneUseCases,
  ) {}

  public createBet = async (ctx: HttpContext) => {
    const { request, response } = ctx

    const providerId = request.body().providerId
    const bet = { ...request.body() }

    try {
      const round = await this.roundUseCases.findRoundByUuid(bet.roundUuid)
      if (!round) return response.status(404).json({ error: 'No se encuentra el round' })

      const createBet = await this.betUseCases.createBet(bet as BetEntity)

      return response.status(201).json({ message: 'Bet creado!', createBet })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo crear el bet!', error })
    }
  }
  public getWinner = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { uuid, wheelId } = request.qs()

    try {
      const round = await this.roundUseCases.findRoundByUuid(uuid)
      if (!round) return response.status(404).json({ error: 'No se encuentra el round' })

      const wheelFortune = await this.wheelFortuneUseCases.getByUuid(wheelId)
      if (!wheelFortune)
        return response.status(404).json({ error: 'No se encuentra el wheelFortune' })

      // comprobar player

      const { result, jackpot } = round
      const filter = useWinnerFilter(result as number)
      const betWinner = await this.betUseCases.getWinner({
        roundUuid: round.uuid,
        ...filter,
      })

      if (!betWinner) {
        return response.ok({ message: "you have not won :'(", win: false })
      }

      const bets = await this.betUseCases.findBetsByRoundUuid(round.uuid!)
      const earnings = getBetEarnings(wheelFortune, betWinner, result as number, jackpot as Jackpot)

      return response.status(200).json({ message: "you've won!", win: true, earnings, bets })
    } catch (error) {
      console.log('ERROR WINNER => ', error)
      response.internalServerError({ error: 'Internal server error' })
    }
  }
}
