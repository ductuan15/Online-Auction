import { Server, Socket } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { ExtendedError } from 'socket.io/dist/namespace.js'
import passport from '../auth/passport.js'
import Prisma from '@prisma/client'
import c from 'ansi-colors'

let io: Server
declare module 'http' {
  interface IncomingMessage {
    user: Prisma.User
  }
}
// convert a connect middleware to a Socket.IO middleware
const wrap =
  (middleware: any) => (socket: Socket, next: (err?: ExtendedError) => void) =>
    middleware(socket.request, {}, next)

const onConnect = (socket: Socket) => {
  console.log(c.bgMagenta(
    `new connection ${socket.id}`
  ))
  // console.log(socket.request.user)

  socket.on('whoami', () => {
    // cb(socket.request.user ? socket.request.user.uuid : '')
    console.log(`${socket.request.user.uuid} - ${socket.request.user.name} greeted you <3`)
  })

  socket.on('disconnect', () => {
    console.log(c.magenta(
      `${socket.id} - ${socket.request.user.name} disconnected`
    ))
  })
}

const initSocketIo = (server: HTTPServer): Server => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  })

  io.use(wrap(passport.initialize()))
  io.use(wrap(passport.authenticate('jwt', { session: false })))
  io.on('connection', onConnect)

  return io
}

export default initSocketIo
