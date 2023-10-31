import { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

type Auth = { [x: string]: string | undefined }

type Options = { auth?: Auth; onCompleted?: () => void }

export class SocketClient {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>

  constructor(url: string, { auth = {}, onCompleted }: Options = {}) {
    this.socket = io(url, {
      transports: ['websocket'],
      reconnectionDelay: 0,
      forceNew: true,
      auth,
      // TODO: DELETE QUERY FOR CONNECT SOCKET CLIENT
      query: {
        userId: '123',
        gameUuid: '123',
      }
    })
    onCompleted && onCompleted()
  }
}
