import { io } from 'socket.io-client'

class SocketClient {
  public clientIo
  public mainIo

  constructor() {
    this.clientIo = io(process.env.WEB_SOCKET_URL as string, {
      transports: ['websocket'],
    })
    this.mainIo = io(process.env.BACK_URL as string, {
      query: {
        gameUuid: '63ef9a172ef4d186807f80d5',
        userId: '100',
      },
      transports: ['websocket'],
    })
  }
}

export default new SocketClient()
