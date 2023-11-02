import { HttpContext } from '@adonisjs/core/build/standalone';
import { RoundUseCases } from '../application/round.use-cases';
import Redis from '@ioc:Adonis/Addons/Redis';
import { END_GAME_PUB_SUB } from 'App/WheelFortune/infraestructure/constants';
import { Phase } from 'App/Game/domain/types/phase.interfaces';
import { RoundControlRedisUseCases } from '../application/round-control.redis.use-cases';
import { sleep } from 'App/Shared/Helpers/sleep';
import SocketServer from 'App/Services/Ws'
import { WheelFortuneUseCases } from 'App/WheelFortune/apllication/wheel-fortune.use-cases';

export class RoundController {
  constructor(
    private roundUseCases: RoundUseCases,
    private roundControlRedisUseCases: RoundControlRedisUseCases,
    private wheelUseCases: WheelFortuneUseCases
  ) { }

  private changePhase = async (
    table: string,
    phase: Phase,
    io: any,
    timeWait?: number
  ) => {
    // const players =
    //   await this.gameControlUseCase.getEnablePlayersWithOutOptions()
    // const countPlayers = players.length

    await this.roundControlRedisUseCases.toPhase(table, phase)
    // Logger.info(`change phase: ${phase}`)
    io.emit('a', {
      phase: await this.roundControlRedisUseCases.getPhase(table),
      timeWait,
      // countPlayers,
    })
    if (timeWait) await sleep(timeWait)
  }

  public start = async (gameUuid: string = '89cc5c2c-b2ae-4694-92a3-b77bb2d42e09') => {
    try {
      const game = await this.wheelUseCases.getByUuid(gameUuid);

      if (!game) return

      const round = await this.roundUseCases.createRound({ gameUuid: game.uuid!, identifierNumber: '1-1', providerId: game.providerId, start_date: new Date() })

      Redis.set(`round:${round.uuid}`, JSON.stringify(round));

      const betTime = game.betTime;

      await this.changePhase(game.providerId, 'bet_time', SocketServer.io, betTime)
      await this.roundUseCases.closeBetsIndRound(round.uuid!)

      await this.changePhase(game.providerId, 'processing_jackpot', SocketServer.io)

      const roundWithJackpot = await this.roundUseCases.setJackpotInRound(round.uuid!, { multiplier: 10, number: 20 });

      if (!roundWithJackpot) return

      Redis.set(`round:${round.uuid}`, JSON.stringify(roundWithJackpot))

      await this.changePhase(game.providerId, 'ready_jackpot', SocketServer.io)

      await this.changePhase(game.providerId, 'wait_result', SocketServer.io)
    } catch (error) {
      console.log('ERROR START -> ROUND CONTROLLER', error);

    }
  }

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

      const roundClosed = await this.roundUseCases.closeRound(uuid, result);

      const round = await Redis.get(`round:${uuid}`);
      const parsedRound = JSON.parse(round as string);
      Redis.set(`round:${uuid}`, JSON.stringify({ ...parsedRound, open: false }))

      await this.changePhase(roundClosed?.providerId!, 'result', SocketServer.io, 4)

      Redis.publish(END_GAME_PUB_SUB, uuid);
    } catch (error) {
      console.log('ERROR RESULT ROUND -> ', error);
      response.internalServerError({ error: 'TALK TO ADMINISTRATOR' });
    }
  }
}