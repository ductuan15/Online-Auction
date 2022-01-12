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
}

const useSocketContext = (): SocketContextType => {
  return useContext(SocketContext)
}

export default useSocketContext

export function SocketProvider({ children }: SocketProviderProps): JSX.Element {
  const { user } = useAuth()

  const socket = useMemo(() => {
    if (user?.token) {
      try {
        console.log('connect')
        const socket = connect(config.API_HOST_NAME, {
          extraHeaders: {
            Authorization: `Bearer ${user.token}`,
          },
          reconnection: false,
          reconnectionAttempts: 5,
        })
        socket.io.on('reconnect_error', () => {
          socket.disconnect()
        })
        return socket
      } catch (e) {
        console.log(e)
        return null
      }
    } else {
      return null
    }
  }, [user?.token])

  useEffect(() => {
    if (socket) {
      socket.emit('whoami')
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