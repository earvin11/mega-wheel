/* eslint-disable @typescript-eslint/naming-convention */
import Logger from '@ioc:Adonis/Core/Logger'
import Redis from '@ioc:Adonis/Addons/Redis'
import SocketServer from '../app/Services/Ws'
import {
  BET,
  BET_ERROR_EVENT,
  BET_SUCCESS_EVENT,
  START_GAME_PUB_SUB,
} from 'App/WheelFortune/infraestructure/constants'
import { roundControlRedisUseCases } from 'App/Round/infraestructure/dependencies'
import { betControlRedisRepository, betUseCases } from 'App/Bet/infraestructure/dependencies'
import { operatorUseCases } from 'App/Operator/infrastructure/dependencies'
import { wheelFortuneUseCases } from 'App/WheelFortune/infraestructure/dependencies'
import { currencyUseCases } from 'App/Currencies/infrastructure/dependencies'
import { playerUseCases } from 'App/Player/infraestructure/dependencies'

import { calculateAmountBet } from 'App/Shared/Helpers/utils-functions'
import { BetEntity } from 'App/Bet/domain'
import { DebitWalletRequest } from 'App/Shared/Interfaces/wallet.interfaces'
import { sendBet } from 'App/Shared/Helpers/wallet-request'
import { getPlayersOnline } from 'App/Shared/Helpers/get-players-online'
const Ws = SocketServer
Ws.boot()

/**
 * Listen for incoming socket connections
 */

// Ws.io.use(async (socket, next) => {
//   const gameUuid = socket.handshake.query['gameUuid']
//   const user = socket.handshake.query['userId']
//   if (!gameUuid || !user) {
//     next(new Error('unknown game'))
//   }
//   next()
// })

Ws.io.on('connection', async (socket) => {
  const gameUuid = socket.handshake.query['gameUuid']
  const user = socket.handshake.query['userId']
  const isCrupier = socket.handshake.query['crupier']
  const room = `${gameUuid}`
  const userRoom = `${gameUuid}-${user}`
  const userStatus = `${user}`
  const rooms = [room, userRoom, userStatus]

  socket.join(rooms)

  const dataUser = {
    socketID: socket.id,
    userId: socket.handshake.query['userId'],
    room: socket.handshake.query['gameUuid'],
  }

  const playersOnline = (await Redis.get(`players-online:${gameUuid}`)) || '[]'
  const playersParsed = JSON.parse(playersOnline)

  if (!isCrupier) {
    const existSession = playersParsed.findIndex((user) => user.userId === dataUser.userId)

    if (existSession === -1) {
      playersParsed.push(dataUser)
    } else {
      playersParsed[existSession] = dataUser
    }
    // TODO: BUSCAR EL PLAYER EN MONGO
    Redis.set(`players-online:${gameUuid}`, JSON.stringify(playersParsed))

    const playersOnline: any[] = await getPlayersOnline()

    Ws.io.emit('users-online', { usersOnline: playersOnline })
  }

  socket.on(BET, async (betData: any) => {
    console.log('BET')

    const {
      player, //UUID
      operatorId,
      gameId,
      bet,
      currency,
      user_id,
      round: roundId,
      platform,
      // plaerCountry,
      // player_ip,
      // userAgent,
    } = betData

    try {
      // Validar ronda
      const round = await roundControlRedisUseCases.getRound(roundId)
      if (!round)
        return Ws.io.to(userRoom).emit(BET_ERROR_EVENT, { message: 'Error, round not found' })

      // const phaseRound = await roundControlRedisUseCases.getPhase(providerId)
      //   if (phaseRound !== 'bet_time') return Ws.io.to(userRoom)
      //   .emit(BET_ERROR_EVENT, { message: 'Round is closed' });

      if (!round.open)
        return Ws.io.to(userRoom).emit(BET_ERROR_EVENT, { message: 'Round is closed' })

      // Validar operador
      const operator = await operatorUseCases.getOperatorByUuid(operatorId)
      if (!operator || !operator.status || !operator.available)
        return Ws.io.to(userRoom).emit(BET_ERROR_EVENT, { message: 'Operator not available' })

      // Validar juego
      const game = await wheelFortuneUseCases.getByUuid(gameId)
      if (!game) return Ws.io.to(userRoom).emit(BET_ERROR_EVENT, { message: 'Game not found' })

      // Currency
      const currencyData = await currencyUseCases.getCurrencyByIsoCode(currency)
      if (!currencyData)
        return Ws.io.to(userRoom).emit(BET_ERROR_EVENT, { message: 'Currency not found' })

      // Player
      const playerData = await playerUseCases.findByUuid(player)
      if (!playerData || !playerData.status)
        return Ws.io.to(userRoom).emit(BET_ERROR_EVENT, { message: 'PLayer not found or disabled' })

      const totalAmount = calculateAmountBet(bet)
      const dataBet: BetEntity = {
        bet,
        playerUuid: player,
        roundUuid: roundId,
        totalAmount,
        currencyUuid: currencyData.uuid!,
        gameUuid: game.uuid!,
        currencyIsoCode: currencyData.isoCode
      }

      // Instanciar apuesta
      const createBet = betUseCases.instanceBet({ ...dataBet } as BetEntity)

      // Crear objeto para la wallet
      const objWallet: DebitWalletRequest = {
        user_id: String(user_id),
        amount: totalAmount,
        round_id: String(roundId),
        bet_id: createBet.uuid!,
        game_id: game.uuid!,
        bet_code: createBet.uuid!,
        bet_date: String(new Date()),
        platform: String(platform),
        currency: currencyData.isoCode,
        transactionType: 'bet',
      }

      // Envia la bet a la wallet
      try {
        const respWallet: any = await sendBet(operator.endpointBet, objWallet)
        if (!respWallet.data.ok) {
          // await logUseCases.createLog({
          //   typeError: TypesLogsErrors.debit,
          //   request: objWallet,
          //   response: respWallet.data,
          //   error: respWallet.data.msg || '',
          //   player,
          // })
          return Ws.io.to(userRoom).emit(BET_ERROR_EVENT, {
            msg: respWallet.data.msg,
            error: 'error in wallet',
          })
        }
      } catch (error) {
        console.log('ERROR SEND BET TO WALLET -> ', error)
        // await logUseCases.createLog({
        //   typeError: TypesLogsErrors.debit,
        //   request: objWallet,
        //   response: error,
        //   player,
        // })
        return Ws.io.to(userRoom).emit(BET_ERROR_EVENT, {
          error: 'error in wallet',
        })
      }

      // Guardar apuesta
      const betCreated = await betUseCases.saveBet(createBet)
      await betControlRedisRepository.setBet(betCreated)

      return Ws.io.to(userRoom).emit(BET_SUCCESS_EVENT, {
        ok: true,
        message: 'Success',
        createBet,
      })
    } catch (error) {
      console.log(error)
      return Ws.io.to(userRoom).emit(BET_ERROR_EVENT, {
        message: 'Internal server error',
      })
    }
  })

  socket.on('crupier:connection', async (providerId) => {
    Logger.info('croupier.socket - connect')
    await Redis.publish(START_GAME_PUB_SUB, providerId)
  })

  socket.on('disconnect', async () => {
    const newPlayers = playersParsed.filter((player) => player.userId !== user)
    Redis.set(`players-online:${gameUuid}`, JSON.stringify(newPlayers))

    const playersOnline: any[] = await getPlayersOnline()

    Ws.io.emit('users-online', { usersOnline: playersOnline })
  })
})
