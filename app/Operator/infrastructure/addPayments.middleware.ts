import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import { operatorUseCases } from './dependencies';
import { gameUseCases } from 'App/Game/infrastructure/dependencies';

export default class addPaymentsToOperatorMiddleware {
  public handle = async ({ request, response }: HttpContextContract, next: () => Promise<void>) => {
    const { uuid } = request.params();
    const gameUuid = request.param('game-uuid');
    try {
      const operator = await operatorUseCases.getOperatorByUuid(uuid);
      if (!operator) return response.status(400).json({ error: 'Operador no encontrado!' })
      
      if (!operator.games?.includes(gameUuid)) return response.status(400).json({ error: 'El operador no tiene el juego asignado' });

      const game = await gameUseCases.getGameByUuid(gameUuid);
      if (!game) return response.status(400).json({ error: 'El juego no existe' });

      const paymentsSchema = schema.create({
        game: schema.string(),
        chanceSimple: schema.number(),
        tie: schema.number(),
        perfectTie: schema.number(),
        jackpot: schema.number(),
        goldenK: schema.number(),
        size: schema.number(),
        parity: schema.number(),
        color: schema.number(),
      })

      await request.validate({
        schema: paymentsSchema,
      })

      await next()
    } catch (error) {
      response.status(400).json({ message: 'Debe completar todos los campos requeridos!', error })
    }
  }
}
