import { Server } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'

class SocketServer {
  public io: Server
  private booted = false

  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    console.log('SOCKET SERVER CONNECT')
    this.booted = true
    this.io = new Server(AdonisServer.instance, {
      transports: ['websocket'],
    })
  }
}

export default new SocketServer()
