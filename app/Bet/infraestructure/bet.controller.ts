import { HttpContext } from '@adonisjs/core/build/standalone'
import { BetUseCases } from '../application/bet.use-cases'
import { roundUseCases } from 'App/Round/infraestructure/dependencies'
import { BetEntity } from '../domain'

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
}
