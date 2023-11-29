import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { operatorUseCases } from './dependencies';
import { gameUseCases } from 'App/Game/infrastructure/dependencies';

export default class addPaymentsToOperatorMiddleware {
  public handle = async ({ request, response }: HttpContextContract, next: () => Promise<void>) => {
    const { uuid } = request.params();
    const gameUuid = request.param('game-uuid');
    try {
      const operator = await operatorUseCases.getOperatorByUuid(uuid);
      if (!operator) return response.status(400).json({ error: 'Operador no encontrado!' })
      

      const game = await gameUseCases.getGameByUuid(gameUuid);
      if (!game) return response.status(400).json({ error: 'El juego no existe' });
      await next()
    } catch (error) {
      response.status(400).json({ message: 'Debe completar todos los campos requeridos!', error })
    }
  }
}
