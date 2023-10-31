import { SocketClient } from './SocketClient/SocketClient'
import Logger from '@ioc:Adonis/Core/Logger'

const SOCKET_API =
  process.env.SOCKET_API && !process.env.TEST
    ? process.env.SOCKET_API
    : 'http://localhost:2222'

console.log('SOCKET_API', SOCKET_API);

export const socketClientCroupier = new SocketClient(SOCKET_API, {
  onCompleted() {
    Logger.info('SOCKET CLIENT CROUPIER STARTED')
  },
})
