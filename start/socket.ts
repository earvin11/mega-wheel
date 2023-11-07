/* eslint-disable @typescript-eslint/naming-convention */
import Logger from '@ioc:Adonis/Core/Logger'
import { BET, START_GAME_PUB_SUB } from 'App/WheelFortune/infraestructure/constants'
import SocketServer from '../app/Services/Ws'
import Redis from '@ioc:Adonis/Addons/Redis';
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
  const room = `${gameUuid}`
  const userRoom = `${gameUuid}-${user}`
  const userStatus = `${user}`
  const rooms = [room, userRoom, userStatus]

  socket.join(rooms)

  socket.on(BET, () => {
    console.log('BET');
  })

  socket.on('crupier:connection', async (providerId) => {
    Logger.info('croupier.socket - connect')
    await Redis.publish(START_GAME_PUB_SUB, providerId)
  })

});

