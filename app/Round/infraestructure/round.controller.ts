import { HttpContext } from '@adonisjs/core/build/standalone';
import { RoundUseCases } from '../application/round.use-cases';
import Redis from '@ioc:Adonis/Addons/Redis';
import { END_GAME_PUB_SUB } from 'App/WheelFortune/infraestructure/constants';

export class RoundController {
  constructor(
    private roundUseCases: RoundUseCases
  ) { }

  public createRound = async ({ request, response }: HttpContext) => {
    try {
      const {
        gameUuid,
        providerId,
        start_date = 'algo',
        end_date = 'algo+1',
      } = request.body();

      const identifierNumber = 'algo-m1';

      const newRound = await this.roundUseCases.createRound({
        gameUuid,
        identifierNumber,
        providerId,
        start_date,
        end_date,
      });

      response.ok({ message: 'Round created', round: newRound });
    } catch (error) {
      console.log('ERROR CREATE ROUND -> ', error);
      response.internalServerError({ error: 'TALK TO ADMINISTRATOR' });
    }
  };

  public result = async ({ request, response }: HttpContext) => {
    try {
      const { uuid, result } = request.body();

      await this.roundUseCases.closeRound(uuid, result);

      const round = await Redis.get(`round:${uuid}`);
      const parsedRound = JSON.parse(round as string);
      Redis.set(`round:${uuid}`, JSON.stringify({ ...parsedRound, open: false }))

      Redis.publish(END_GAME_PUB_SUB, uuid);
    } catch (error) {
      console.log('ERROR RESULT ROUND -> ', error);
      response.internalServerError({ error: 'TALK TO ADMINISTRATOR' });
    }
  }
}