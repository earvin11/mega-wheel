import { Server } from 'socket.io'
import {
  InstanceServer,
  SocketGroup,
  SocketController,
  SocketListeners,
  SocketReservatedEventOptions,
  SocketOptions,
  SocketReservedEvents,
  SocketStartOptions,
} from './interfaces'
import { SocketControl } from './libs'

export class SocketServer extends SocketControl {
  public io: Server

  constructor() {
    super()
  }

  public addListener<Ev extends string>(
    ev: Ev,
    controller: SocketController,
    { middlewares = [], prefix }: SocketOptions = {}
  ) {
    return super._addListener(ev, controller, { middlewares, prefix })
  }

  public addReservatedListener(
    ev: SocketReservedEvents,
    controller: SocketController,
    { middlewares = [] }: SocketReservatedEventOptions = {}
  ) {
    return super._addListener(ev, controller, { middlewares }, true)
  }

  private convertGroupToListener(group: SocketGroup) {
    const Setlisteners = new Map<string, SocketListeners>()
    for (const listener of this.listeners) {
      if (listener.isReservated) continue
      Setlisteners.set(listener.ev, listener)
    }

    const stack = [group]
    while (stack.length) {
      const { node, middlewares, prefix } = stack.pop()!
      for (const { controller, ev, middlewares: listenerMiddleware } of node.listeners) {
        const event = prefix ? `${prefix}/${ev}` : ev

        const listener = Setlisteners.get(event)
        if (listener) throw new Error(`the event ${event} exists`)

        Setlisteners.set(event, {
          ev: event,
          controller,
          middlewares: [...middlewares, ...node.middlewares, ...listenerMiddleware],
          isReservated: false,
        })
      }
      for (const group of node.groups) {
        stack.push({
          node: group.node,
          prefix:
            prefix && group.prefix
              ? `${prefix}/${group.prefix}`
              : prefix && !group.prefix
              ? prefix
              : group.prefix,
          middlewares: [...middlewares, ...node.middlewares, ...group.middlewares],
        })
      }
    }
    return Array.from(Setlisteners.values())
  }

  public start = async (
    instanceServer: InstanceServer,
    { onComplete, onConnected }: SocketStartOptions = {}
  ) => {
    this.io = new Server(instanceServer, {
      transports: ['websocket'],
    })
    const listeners = this.groups.map((group) => this.convertGroupToListener(group)).flat()
    const transformedListeners = [...this.listeners, ...listeners].map((listener) =>
      listener.isReservated ? listener : { ...listener, ev: `/${listener.ev}` }
    )
    const events = transformedListeners.map(({ ev }) => ev)
    if (onComplete) await onComplete({ channels: events })

    this.io.on('connection', (socket) => {
      socket.use((event, next) => {
        event[1] = { body: { ...event[1] }, event: event[0] }
        next()
      })

      for (const middleware of this.middlewares)
        socket.use((events, next) =>
          middleware.handler(
            events[1],
            { socket, io: this.io, response: this.buildResponse(events[1]) },
            next
          )
        )

      for (const { controller, ev, middlewares } of transformedListeners) {
        if (!controller) return

        for (const middleware of middlewares) {
          socket.use((events, next) =>
            events[0] === ev
              ? middleware.handler(
                  events[1],
                  { socket, io: this.io, response: this.buildResponse(events[1]) },
                  next
                )
              : next()
          )
        }

        socket.on(ev, (event, callback) =>
          controller(event, { socket, io: this.io, response: this.buildResponse(callback) })
        )
      }

      onConnected && onConnected(socket, { channels: events })
    })
  }

  close(fn?: (err?: Error | undefined) => void) {
    if (this.io) this.io.close(fn)
  }

  private buildResponse = <T>(callback: (data: T) => void) => {
    if (!callback || typeof callback !== 'function') return () => {}
    return (data: T) => callback(data)
  }
}
