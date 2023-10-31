import { Server } from 'socket.io'
import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export type SocketClientIo = Socket<DefaultEventsMap, DefaultEventsMap>
export type SocketClientRequest = { body: any; [x: string]: any }
export type SocketClientConnection = {
    socket: SocketClientIo
    io: Server
    [x: string]: any
}
