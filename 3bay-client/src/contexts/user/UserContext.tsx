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
import UserService from '../../services/user.service'
import { useAuth } from './AuthContext'

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
        if (authData) {
          const user = await UserService.getUserInfo(authData)
          dispatch({
            type: 'GET_ACCOUNT_INFO',
            payload: user,
          })
        }
      } catch (e) {
        console.log(e)
      }
    })()
  }, [])

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
