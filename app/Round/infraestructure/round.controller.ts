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

  public start = async (providerId: string = 'W1') => {
    try {
      const games = await this.wheelUseCases.getManyBryProviderId(providerId);

      if (!games || !games.length) return

      const rounds = await Promise.all(
        games.map(({ providerId, uuid }) => {
          return this.roundUseCases.createRound({
            gameUuid: uuid!,
            identifierNumber: '1',
            providerId,
            start_date: new Date()
          })
            .then((round) =>
              this.roundControlRedisUseCases.setRound(round.uuid!, providerId)
            )
        })
      )

      const betTime = games[0].betTime;

      await this.changePhase(providerId, 'bet_time', SocketServer.io, betTime)
      await Promise.all(
        rounds.map(round => {
          this.roundUseCases.closeBetsIndRound(round)
        })
      )

      await this.changePhase(providerId, 'processing_jackpot', SocketServer.io)

      await Promise.all(
        rounds.map(round => {
          this.roundUseCases.setJackpotInRound(round!, { multiplier: 10, number: 20 });
        })
      )

      // if (!roundWithJackpot) return

      // Redis.set(`round:${round.uuid}`, JSON.stringify(roundWithJackpot))

      await this.changePhase(providerId, 'ready_jackpot', SocketServer.io)

      await this.changePhase(providerId, 'wait_result', SocketServer.io)
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