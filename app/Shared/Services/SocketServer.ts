import { Server } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'
import Logger from '@ioc:Adonis/Core/Logger'

// TODO: Delete this file if we are not going to use it

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

    Logger.info('SOCKET SERVER CONNECT - OLD VERSION')
    this.booted = true
    this.io = new Server(AdonisServer.instance, {
      transports: ['websocket'],
    })
  }
}

export default new SocketServer()
