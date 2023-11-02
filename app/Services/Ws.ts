import { Server } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'
import Logger from '@ioc:Adonis/Core/Logger'

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

    this.booted = true
    this.io = new Server(AdonisServer.instance, {
      transports: ['websocket'],
    })
    Logger.info('SOCKET SERVER CONNECT - WHEEL')
  }
}

export default new SocketServer()