import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react'
import { connect, Socket } from 'socket.io-client'
import { useAuth } from '../user/AuthContext'
import config from '../../config'

type SocketProviderProps = {
  children: ReactNode
}

type SocketContextType = {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
})

export enum SocketEvent {
  AUCTION_UPDATE = 'auction_update',
  AUCTION_NOTIFY = 'auction_notify',
  USER_LOGOUT = 'user_logout',
  CATEGORY_UPDATE = 'category_update',
  CONNECT = 'connection',
  DISCONNECT = 'disconnect',
  WHO_AM_I = 'whoami',
  SUBSCRIBE_AUCTION = 'subscribe_auction',
}

const useSocketContext = (): SocketContextType => {
  return useContext(SocketContext)
}

export default useSocketContext

export function SocketProvider({ children }: SocketProviderProps): JSX.Element {
  const { user } = useAuth()

  const socket = useMemo(() => {
      try {
        console.log('connect')
        const socket = connect(config.API_HOST_NAME, {
          extraHeaders: user?.token ? {
            Authorization: `Bearer ${user.token}`,
          } : {},
          reconnection: false,
          reconnectionAttempts: 5,
        })

        socket.io.on('reconnect_error', () => {
          socket.disconnect()
        })

        return socket
      } catch (e) {
        // console.log(e)
        return null
      }
    }
  , [user?.token])

  useEffect(() => {
    if (socket) {
      socket.emit(SocketEvent.WHO_AM_I)
    }
    return () => {
      if (socket) {
        console.log('disconnect')
        socket?.disconnect()
      }
    }
  }, [socket])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}