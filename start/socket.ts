/* eslint-disable @typescript-eslint/naming-convention */
import SocketServer from '../app/Shared/Services/SocketServer'
const Ws = SocketServer
// import SocketClient from 'App/Shared/Services/SocketClient'
Ws.boot()

// !CLIENT SOCKET
// const { clientIo, mainIo } = SocketClient
// !

/**
 * Listen for incoming socket connections
 */

Ws.io.use(async (socket, next) => {
  const gameUuid = socket.handshake.query['gameUuid']
  const user = socket.handshake.query['userId']
  if (!gameUuid || !user) {
    next(new Error('unknown game'))
  }
  next()
})

Ws.io.on('connection', (socket) => {
  const gameUuid = socket.handshake.query['gameUuid']
  const user = socket.handshake.query['userId']
  const room = `${gameUuid}`
  const userRoom = `${gameUuid}-${user}`
  const userStatus = `${user}`
  const rooms = [room, userRoom, userStatus]

  socket.join(rooms)

  socket.emit('news', { hello: 'world' })

  socket.on('chat', (data) => {
    console.log('Prueba de socke manao', data)
  })

  socket.on('bet', async (data: any) => {
   
  })

  socket.on('winner', async (data: any) => {
    
  })
});

// ! LISTEN FOR OTHER SOCKETS

// clientIo.on('news', (data) => {
//   console.log('news',data);
// })

// clientIo.on('sendCardToClientDRAGON', async () => {})
