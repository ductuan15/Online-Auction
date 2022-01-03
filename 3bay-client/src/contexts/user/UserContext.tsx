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

  const { user: authData } = useAuth()

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
          const auctionList = await UserService.getUserAuctionList()
          console.log(auctionList)
          dispatch({
            type: 'UPDATE_AUCTION_LIST',
            payload: auctionList,
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
