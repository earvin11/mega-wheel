import { HttpContext } from '@adonisjs/core/build/standalone';
import { RoundUseCases } from '../application/round.use-cases';
import Redis from '@ioc:Adonis/Addons/Redis';
import { CHANGE_PHASE_EVENT, END_GAME_PUB_SUB } from 'App/WheelFortune/infraestructure/constants';
import { RoundControlRedisUseCases } from '../application/round-control.redis.use-cases';
import { sleep } from 'App/Shared/Helpers/sleep';
import SocketServer from 'App/Services/Ws'
import { WheelFortuneUseCases } from 'App/WheelFortune/apllication/wheel-fortune.use-cases';
import { Phase, RoundEntity } from '../domain';
import Logger from '@ioc:Adonis/Core/Logger'

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

    await this.roundControlRedisUseCases.toPhase(table, phase)
    Logger.info(`change phase: ${phase}`)
    io.emit(CHANGE_PHASE_EVENT, {
      phase: await this.roundControlRedisUseCases.getPhase(table),
      timeWait,
    })
    if (timeWait) await sleep(timeWait)
  }

  private updateRoundRedis = async (rounds: (RoundEntity | null)[]) => {
    await Promise.all(
      rounds.map(round => {
        if (round)
          this.roundControlRedisUseCases.setRound(round)
      })
    )
  }

  public start = async (providerId: string = 'W1') => {
    try {
      const phase = await this.roundControlRedisUseCases.getPhase(providerId);
      if(phase !== 'processing_next_round') return;

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
            .then((round) => {
              this.roundControlRedisUseCases.setRound(round)

              SocketServer.io.to(`${uuid!}`).emit('round:start', {
                msg: 'Round opened',
                round: {
                  start_date: round.start_date,
                  ID_Ronda: round.uuid,
                  identifierNumber: round.identifierNumber,
                }
              })
              return round
            })
        })
      )

      const betTime = games[0].betTime;

      await this.changePhase(providerId, 'bet_time', SocketServer.io, betTime)

      const roundsClosed = await Promise.all(
        rounds.map(round =>
          this.roundUseCases.closeBetsIndRound(round.uuid!)
        )
      )

      await this.updateRoundRedis(roundsClosed);

      await this.changePhase(providerId, 'processing_jackpot', SocketServer.io)

      const roundsWithJackpot = await Promise.all(
        rounds.map(round =>
          this.roundUseCases.setJackpotInRound(round.uuid!, { multiplier: 10, number: 20 })
        )
      )

      await this.updateRoundRedis(roundsWithJackpot);

      rounds.map(round => {
        SocketServer.io.to(`${round.gameUuid!}`).emit('jackpot', {
          msg: 'Jackpot',
          jackpot: { multiplier: 10, number: 20 }
        })
      })

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
      const { providerId, result } = request.body();

      const rounds = await this.roundUseCases.findRoundsByProviderId(providerId);

      if (!rounds.length) return response.notFound({ msg: 'Rounds not founded' })

      await Promise.all(
        rounds.map(round =>
          this.roundUseCases.closeRound(round.uuid, result)
        )
      )

      await Promise.all(
        rounds.map(round => {
          SocketServer.io.to(`${round.gameUuid}`).emit('round:end', {
            msg: 'Round result',
            result
          })
          return Redis.del(`round:${round.uuid}`)
        }
        )
      )
      await this.changePhase(providerId, 'processing_next_round', SocketServer.io);
      Redis.publish(END_GAME_PUB_SUB, '');
    } catch (error) {
      console.log('ERROR RESULT ROUND -> ', error);
      response.internalServerError({ error: 'TALK TO ADMINISTRATOR' });
    }
  }
}