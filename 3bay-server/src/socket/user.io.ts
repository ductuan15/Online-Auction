import { emitEventToUsers } from './socket.io.js'
import { SocketEvent } from './socket-event.js'

export async function kindlyAskUserToLogout(uuid: string) {
  emitEventToUsers([uuid], SocketEvent.USER_LOGOUT)
}

