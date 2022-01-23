import { Server, Socket } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { ExtendedError } from 'socket.io/dist/namespace.js'
import passport from '../auth/passport.js'
import Prisma from '@prisma/client'
import c from 'ansi-colors'
import { NotifyData, SocketEvent } from './socket-event.js'
import { AuctionFromGetDetails, auctionSocketMap } from './auction.io.js'

let io: Server

// convert a connect middleware to a Socket.IO middleware
const wrap =
  (middleware: any) => (socket: Socket, next: (err?: ExtendedError) => void) =>
    middleware(socket.request, {}, next)

declare module 'http' {
  interface IncomingMessage {
    user?: Prisma.User
  }
}

type SocketData = AuctionFromGetDetails | NotifyData

export function getSocket(): Server {
  return io ?? null
}

// key: user's uuid, value: a set of socket ids
const users = new Map<string, Set<string>>()

function whoAmI(socket: Socket) {
  return () => {
    // cb(socket.request.user ? socket.request.user.uuid : '')
    if (socket.request.user) {
      console.log(
        c.red(
          `[Socket] ${socket.request.user.uuid} - ${socket.request.user.name} greeted you <3`,
        ),
      )
      const uuid = socket.request.user.uuid
      if (!users.has(uuid)) {
        users.set(uuid, new Set([socket.id]))
        console.log(
          c.blue(`[Socket] User map: add ${uuid}, add socket ID ${socket.id}`),
        )
      } else {
        users.get(uuid)?.add(socket.id)
        console.log(
          c.blue(
            `[Socket] User map: update ${uuid}, add socket ID ${socket.id}`,
          ),
        )
      }
    } else {
      console.log(
        c.red(
          `[Socket] ${socket.id} greeted you <3`,
        ),
      )
    }
  }
}

function disconnect(socket: Socket) {
  return () => {
    if (socket.request.user) {
      console.log(
        c.magenta(
          `[Socket] ${socket.id} - ${socket.request.user.name} disconnected`,
        ),
      )
      const uuid = socket.request.user.uuid
      if (users.has(uuid)) {
        const result = users.get(uuid)?.delete(socket.id)
        if (result) {
          console.log(c.blue(`[Socket] Remove ${socket.id} from users map`))
        }
      }
    }
    auctionSocketMap.removeSocketId(socket.id)
  }
}

function subscribeAuction(socket: Socket) {
  return (auctionId: number | undefined) => {
    if (auctionId) {
      console.log(
        c.blue(`[Socket] Subscribe auction ${auctionId} by ${socket.id}`),
      )
      auctionSocketMap.add(auctionId, socket.id)
    } else {
      console.log(
        c.blue(`[Socket] Remove auction subscription of ${socket.id}`),
      )
      auctionSocketMap.removeSocketId(socket.id)
    }
  }
}

function onConnect(socket: Socket) {
  console.log(c.bgMagenta(`[Socket] New connection ${socket.id}`))
  // console.log(socket.request.user)

  socket.on(SocketEvent.WHO_AM_I, whoAmI(socket))

  socket.on(SocketEvent.DISCONNECT, disconnect(socket))

  socket.on(SocketEvent.SUBSCRIBE_AUCTION, subscribeAuction(socket))
}

function initSocketIo(server: HTTPServer): Server {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  })

  io.use(wrap(passport.initialize()))
  io.use(
    wrap(
      passport.authenticate(
        ['jwt', 'anonymous'],
        { session: false }
      ),
    ),
  )
  io.on(SocketEvent.CONNECT, onConnect)

  return io
}

export function emitEvent(
  event: SocketEvent,
  data: unknown,
  cb?: (err: unknown, data: unknown) => void,
) {
  const io = getSocket()
  if (!io) {
    return null
  }
  const result = io.emit(event, data, cb)
  console.log(c.blue(`[Socket] Event ${event}`))
  return result
}

export function emitEventToUsers(
  uuids: string[],
  event: SocketEvent,
  data?: SocketData,
  cb?: (err: unknown, data: unknown) => void,
) {
  const io = getSocket()
  if (!io) {
    return
  }

  for (const uuid of uuids) {
    const socketIds = users.get(uuid)
    if (socketIds) {
      for (const socketId of socketIds) {
        io.to(socketId).emit(event, data, cb)
        console.log(c.blue(`[Socket] Event ${event} -> ${socketId}`))
      }
    }
  }
}

export function emitEventToSocketClients(
  socketIds: Set<string> | undefined,
  event: SocketEvent,
  data?: SocketData,
  cb?: (err: unknown, data: unknown) => void,
) {
  const io = getSocket()
  if (!io) {
    return
  }
  if (!socketIds) {
    console.log(c.blue(`[Socket] Event ${event} -> no one`))
    return
  }
  for (const socketId of socketIds) {
    io.to(socketId).emit(event, data, cb)
    console.log(c.blue(`[Socket] Event ${event} -> ${socketId}`))
  }
}

export default initSocketIo
