import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import {
  initialUserState,
  UserAction,
  userReducer,
  UserState,
} from '../../stores/user/user.store'
import { useAuth } from './AuthContext'
import UserService from '../../services/user.service'
import useSocketContext, { SocketEvent } from '../socket/SocketContext'
import { NotifyData } from '../../models/notification'

type UserProviderProps = {
  children: ReactNode
}

type UserContextType = {
  state: UserState
  dispatch: Dispatch<UserAction>
}

const userContextInitialState: UserContextType = {
  state: initialUserState,
  dispatch: () => null,
}

const UserContext = createContext<UserContextType>(userContextInitialState)

export const useUserContext = (): UserContextType => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }: UserProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(userReducer, initialUserState)

  const { user: authData, signOut } = useAuth()

  const { socket } = useSocketContext()

  useEffect(() => {
    ;(async () => {
      try {
        // console.log(authData)
        // console.log(axiosApiInstance.interceptors.response)
        if (authData) {
          // const user = await UserService.getUserInfo(authData)
          const user = await UserService.getUserInfo(authData)
          dispatch({
            type: 'GET_ACCOUNT_INFO',
            payload: user,
          })
          const watchList = await UserService.getUserWatchList()
          dispatch({
            type: 'UPDATE_WATCH_LIST',
            payload: watchList,
          })
        } else {
          dispatch({
            type: 'GET_ACCOUNT_INFO',
            payload: undefined,
          })
        }
      } catch (e) {
        // console.log(e)
      }
    })()
  }, [authData])

  useEffect(() => {
    if (socket) {
      socket?.on(SocketEvent.AUCTION_NOTIFY, (data: NotifyData) => {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: data,
        })
      })

      socket?.on(SocketEvent.USER_LOGOUT, () => {
        signOut(() => {
          window.location.href = '/'
        })
      })
    }
    return () => {
      if (socket) {
        socket?.off(SocketEvent.AUCTION_NOTIFY)
        socket?.off(SocketEvent.USER_LOGOUT)
      }
    }
  }, [signOut, socket])

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch],
  )

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}
