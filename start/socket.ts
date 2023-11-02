/* eslint-disable @typescript-eslint/naming-convention */
import { BET } from 'App/WheelFortune/infraestructure/constants'
import SocketServer from '../app/Services/Ws'
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

Ws.io.on('connection', (socket) => {
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
});

