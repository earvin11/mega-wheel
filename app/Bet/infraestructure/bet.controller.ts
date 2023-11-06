import { HttpContext } from '@adonisjs/core/build/standalone'
import { BetUseCases } from '../application/bet.use-cases'
import { roundUseCases } from 'App/Round/infraestructure/dependencies'
import { BetEntity } from '../domain'
import { wheelFortuneUseCases } from 'App/WheelFortune/infraestructure/dependencies'
import { getBetEarnings, useWinnerFilter } from 'App/Shared/Helpers/wheel-utils'

export class BetController {
  constructor(private betUseCases: BetUseCases) {}

  public createBet = async (ctx: HttpContext) => {
    const { request, response } = ctx

    const bet = { ...request.body() }

    const round = await roundUseCases.findRoundByUuid(bet.round)

    if (!round) {
      return response.status(404).json({ error: 'No se encuentra el round' })
    }
    try {
      const createBet = await this.betUseCases.createBet(bet as BetEntity)

      return response.status(201).json({ message: 'Bet creado!', createBet })
    } catch (error) {
      return response.status(400).json({ message: 'No se pudo crear el bet!', error })
    }
  }
  public getWinner = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { uuid, wheelId } = request.qs()
    const round = await roundUseCases.findRoundByUuid(uuid)

    if (!round) {
      return response.status(404).json({ error: 'No se encuentra el round' })
    }

    const wheelFortune = await wheelFortuneUseCases.getByUuid(wheelId)
    if (!wheelFortune) {
      return response.status(404).json({ error: 'No se encuentra el wheelFortune' })
    }

    // comprobar player

    const { result } = round
    const filter = useWinnerFilter(result as number)
    const betWinner = await this.betUseCases.getWinner({
      round: round.uuid,
      ...filter,
    })

    if (!betWinner) {
      return response.ok({ message: "you have not won :'(", win: false })
    }
    const earnings = getBetEarnings(wheelFortune, betWinner, result as number)

    return response.status(200).json({ message: "you've won!", win: true, earnings })
  }
}
