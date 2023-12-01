/* eslint-disable @typescript-eslint/naming-convention */
import { Worker } from 'worker_threads'
import { HttpContext } from '@adonisjs/core/build/standalone'
import { RoundUseCases } from '../application/round.use-cases'
import Redis from '@ioc:Adonis/Addons/Redis'
import { CHANGE_PHASE_EVENT, END_GAME_PUB_SUB } from '../../WheelFortune/infraestructure/constants'
import { RoundControlRedisUseCases } from '../application/round-control.redis.use-cases'
import { sleep } from '../../Shared/Helpers/sleep'
import SocketServer from '../../Services/Ws'
import { WheelFortuneUseCases } from '../../WheelFortune/apllication/wheel-fortune.use-cases'
import { Phase, RoundEntity } from '../domain'
import Logger from '@ioc:Adonis/Core/Logger'
import { GenerateJWT } from '../../Shared/Helpers/generate-jwt'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RoundBetUseCases } from 'App/RoundBets/application/round-bet-use-case'
import { RoundBetEntity, RoundBetType } from 'App/RoundBets/domain/roundBet.entity'
import { BetEntity } from 'App/Bet/domain'
import { getRoundBet, useAnalisysPosible, useJackpot } from 'App/Shared/Helpers/wheel-utils'
import { BetControlRedisUseCases } from 'App/Bet/application/bet-control.redis.use-cases'
import { transactionsUseCases } from 'App/Transaction/infrastructure/dependencies'
import { CurrencyUseCases } from 'App/Currencies/application/currencyUseCases'


const worker = new Worker('./app/Shared/Services/Worker')

worker.on('message', async (data) => {
  const { cmd } = data

  switch (cmd) {
    case 'winners':
      const { data: dataStringified } = data
      if (!dataStringified) return Logger.info('No hay winners')
      transactionsUseCases.saveCredits(dataStringified)
      break

    default:
      break
  }
})

export class RoundController {
  constructor(
    private roundUseCases: RoundUseCases,
    private roundControlRedisUseCases: RoundControlRedisUseCases,
    private wheelUseCases: WheelFortuneUseCases,
    private roundBetUseCases: RoundBetUseCases,
    private betControlRedisUseCases: BetControlRedisUseCases,
    private currencyUseCases: CurrencyUseCases
  ) { }

  private changePhase = async (table: string, phase: Phase, io: any, timeWait?: number) => {
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
      rounds.map((round) => {
        if (round) this.roundControlRedisUseCases.setRound(round)
      }),
    )
  }

  public start = async (providerId: string = 'W1') => {
    try {
      const phase = await this.roundControlRedisUseCases.getPhase(providerId)
      if (phase !== 'processing_next_round')
        return this.changePhase(providerId, phase, SocketServer.io)

      const games = await this.wheelUseCases.getManyByProviderId(providerId)
      if (!games || !games.length) return

      const rounds = await Promise.all(
        games.map(({ providerId, uuid }) => {
          return this.roundUseCases
            .createRound({
              gameUuid: uuid!,
              identifierNumber: '1',
              providerId,
              start_date: new Date(),
            })
            .then((round) => {
              this.roundControlRedisUseCases.setRound(round)

              SocketServer.io.to(`${uuid!}`).emit('round:start', {
                msg: 'Round opened',
                round: {
                  start_date: round.start_date,
                  ID_Ronda: round.uuid,
                  identifierNumber: round.identifierNumber,
                },
              })
              return round
            })
        }),
      )
      this.roundControlRedisUseCases.setGamesActive(games.map(({ uuid }) => uuid!))
      const betTime = games[0].betTime

      await this.changePhase(providerId, 'bet_time', SocketServer.io, betTime)

      const roundsClosed = await Promise.all(
        rounds.map((round) => this.roundUseCases.closeBetsIndRound(round.uuid!)),
      )

      await this.updateRoundRedis(roundsClosed)
      const currencies = await this.currencyUseCases.getAllCurrencies()
      const bets: BetEntity[] = []
      for (let i = 0; i < roundsClosed.length; i++) {
        const betsToPush = await this.betControlRedisUseCases.getBetsByRound(roundsClosed[i]?.uuid!)

        bets.push(...betsToPush)
      }

      const roundBets: RoundBetType[] = []
      roundsClosed.forEach((r) => {
        const gamefiltered = games.find((g) => g.uuid === r?.gameUuid)
        const betsFiltered = bets.filter((b) => b.roundUuid === r?.uuid)
        const roundBet = getRoundBet(gamefiltered!, betsFiltered, currencies, r?.uuid!)
        roundBets.push(roundBet)
      })

      await this.changePhase(providerId, 'processing_jackpot', SocketServer.io)

      const roundsWithJackpot = await Promise.all(
        rounds.map((round, i) => {
          const gamefiltered = games.find((g) => g.uuid === round?.gameUuid)
          const roundBetFiltered = roundBets.find((r) => r.roundId === round.uuid)
          const analisys = useAnalisysPosible(roundBetFiltered!)
          const { number, mult } = useJackpot(analisys, gamefiltered?.percentReturnToPlayer!)
          const jackpot = { number, multiplier: mult }
          rounds[i].jackpot = jackpot
          return this.roundUseCases.setJackpotInRound(round.uuid!, jackpot)
        }),
      )

      await this.updateRoundRedis(roundsWithJackpot)

      rounds.forEach((round) => {
        SocketServer.io.to(`${round.gameUuid!}`).emit('jackpot', {
          msg: 'Jackpot',
          jackpot: round.jackpot,
        })
      })

      await this.changePhase(providerId, 'wait_result', SocketServer.io)
    } catch (error) {
      console.log('ERROR START -> ROUND CONTROLLER', error)
    }
  }

  public createRound = async ({ request, response }: HttpContext) => {
    try {
      const { gameUuid, providerId, start_date = 'algo', end_date = 'algo+1' } = request.body()

      const identifierNumber = 'algo-m1'

      const newRound = await this.roundUseCases.createRound({
        gameUuid,
        identifierNumber,
        providerId,
        start_date,
        end_date,
      })

      const roundBet = {
        roundUuid: newRound.uuid as string,
      }
      const newRoundBet = await this.roundBetUseCases.createRoundBet(roundBet as RoundBetEntity)

      response.ok({ message: 'Round created', round: newRound, newRoundBet })
    } catch (error) {
      console.log('ERROR CREATE ROUND -> ', error)
      response.internalServerError({ error: 'TALK TO ADMINISTRATOR' })
    }
  }

  public result = async ({ request, response, user }: HttpContextContract) => {
    try {
      const { providerId, result } = request.body()

      const phase = await this.roundControlRedisUseCases.getPhase(providerId)
      if (phase !== 'wait_result')
        return response.badRequest({
          ok: false,
          msg: 'Round opened',
        })

      const rounds = await this.roundUseCases.findRoundsByProviderId(providerId)

      if (!rounds.length) return response.notFound({ msg: 'Rounds not founded' })

      await Promise.all(rounds.map((round) => this.roundUseCases.closeRound(round.uuid, result)))

      await Promise.all(
        rounds.map(async (round) => {
          SocketServer.io.to(`${round.gameUuid}`).emit('round:end', {
            msg: 'Round result',
            result,
          })

          Redis.del(`round:${round.uuid}`)
          Redis.del(`bets:${round.uuid}`)

          worker.postMessage({
            cmd: 'pay-winners',
            winnersData: {
              roundUuid: round.uuid,
            },
          })
          return
        }),
      )

      await this.changePhase(providerId, 'processing_next_round', SocketServer.io)
      Redis.publish(END_GAME_PUB_SUB, providerId)

      const token = await GenerateJWT(user.uuid, user.userName)

      response.ok({
        ok: true,
        token,
      })
    } catch (error) {
      console.log('ERROR RESULT ROUND -> ', error)
      response.internalServerError({ error: 'TALK TO ADMINISTRATOR' })
    }
  }
  // public updateRound = async ({ request, response }: HttpContext) => {
  //   const { uuid } = request.body()

  //   const round = await this.roundUseCases.findRoundByUuid(uuid)
  //   const roundBet = await RoundBetModel.findOne({ roundUuid: uuid }).exec()
  //   const bets = await BetModel.find({ roundUuid: uuid })
  //   const currencies = await CurrencyModel.find()
  //   // const { numbers } = roundBetUpdater(roundBet as RoundBet, bets, currencies)
  //   // const newRoundBet = this.roundBetUseCases.updateRoundBet(roundBet?.uuid as string, numbers)
  //   const completeAnalisys = useAnalisysPosible(roundBet as RoundBetEntity)

  //   const jackpot = useJackpot(completeAnalisys, 95)
  //   const jackpotRandom = useJackpotRandom(completeAnalisys, 95)
  //   response.ok({ round, completeAnalisys, jackpot, jackpotRandom })
  // }
}
