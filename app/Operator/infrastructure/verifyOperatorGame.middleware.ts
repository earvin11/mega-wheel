import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import { operatorUseCases } from './dependencies';
import { gameUseCases } from '../../Game/infrastructure/dependencies';

export default class verifyOperatorGameMiddleware {
  public handle = async ({ request, response }: HttpContextContract, next: () => Promise<void>) => {
    const { uuid } = request.params();
    const gameUuid = request.param('game-uuid');
    const limits  = request.body();

    try {
      const operator = await operatorUseCases.getOperatorByUuid(uuid);
      if (!operator) return response.status(400).json({ error: 'Operador no encontrado!' })
      
      if (!operator.games?.includes(gameUuid)) return response.status(400).json({ error: 'El operador no tiene el juego asignado' });

      const game = await gameUseCases.getGameByUuid(gameUuid);
      if (!game) return response.status(400).json({ error: 'El juego no existe' });

      if (!Object.entries(limits).length) return response.status(400).json({ error: 'Limites necesarios!' })

       const limitsSchema = schema.create({
        game: schema.string(),
        currency: schema.string(),
        minBet: schema.number(),
        maxBet: schema.number(),
        maxBetPosition: schema.number(),
      })

      await request.validate({
        schema: limitsSchema,
      })
      
      await next()
    } catch (error) {
      response.status(400).json({ message: 'Debe completar todos los campos requeridos!', error })
    }
  }
}
