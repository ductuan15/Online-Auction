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
import axiosApiInstance from '../../services/api'
import { UserDetails } from '../../data/user'

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
          const response = await axiosApiInstance.get(
            `/api/user/account/${authData?.user || ''}`,
          )
          const user = response.data as UserDetails
          dispatch({
            type: 'GET_ACCOUNT_INFO',
            payload: user,
          })
        }
      } catch (e) {
        console.log(e)
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
