import { HttpContext } from '@adonisjs/core/build/standalone'
import { BetUseCases } from '../application/bet.use-cases'
import { BetEntity } from '../domain'
import { getBetEarnings, toteBets, useWinnerFilter } from 'App/Shared/Helpers/wheel-utils'
import { RoundUseCases } from 'App/Round/application/round.use-cases'
import { WheelFortuneUseCases } from 'App/WheelFortune/apllication/wheel-fortune.use-cases'
import { RoundControlRedisUseCases } from '../../Round/application/round-control.redis.use-cases';
import { BetControlRedisUseCases } from '../application/bet-control.redis.use-cases';

export class BetController {
  constructor(
    private betUseCases: BetUseCases,
    private betControlRedisUseCases: BetControlRedisUseCases,
    private roundUseCases: RoundUseCases,
    private roundControlRedisUseCases: RoundControlRedisUseCases,
    private wheelFortuneUseCases: WheelFortuneUseCases,
  ) { }

  public createBet = async (ctx: HttpContext) => {
    const { request, response } = ctx

    const providerId = request.body().providerId
    const bet = { ...request.body() }

    try {
      const round = await this.roundControlRedisUseCases.getRound(bet.roundUuid)
      if (!round)
        return response.status(404).json({ error: 'No se encuentra el round' })

      const phaseRound = await this.roundControlRedisUseCases.getPhase(providerId)
      if (phaseRound !== 'bet_time') return response.unauthorized({ error: 'Round closed' });

      const createBet = await this.betUseCases.createBet(bet as BetEntity)

      // SET REDIS
      await this.betControlRedisUseCases.setBet(createBet)

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

      const { result } = round
      const filter = useWinnerFilter(result as number)
      const betWinner = await this.betUseCases.getWinner({
        roundUuid: round.uuid,
        ...filter,
      })

      if (!betWinner) {
        return response.ok({ message: "you have not won :'(", win: false })
      }

      const bets = await this.betUseCases.findBetsByRoundUuid(round.uuid!);
      const totalBets = toteBets(bets)
      const earnings = getBetEarnings(wheelFortune, betWinner, result as number)

      return response
        .status(200)
        .json({ message: "you've won!", win: true, earnings, totalBets, bets })
    } catch (error) {
      console.log('ERROR WINNER => ', error)
      response.internalServerError({ error: 'Internal server error' })
    }
  }
}
