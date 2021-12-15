import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import {
  AuthAction,
  authReducer,
  AuthState,
  initialAuthState,
} from '../../stores/user/auth.store'

type AuthProviderProps = {
  children: ReactNode
}

type AuthContextType = {
  state: AuthState
  dispatch: Dispatch<AuthAction>
  handleSignIn: (user: { id: string; token: string }) => void
  handleSignOut: () => void
}

const AuthContext = createContext<AuthContextType>({
  state: initialAuthState,
  dispatch: () => null,
  handleSignIn(): never {
    throw new Error('Forgot to wrap component in `AuthProvider`')
  },
  handleSignOut(): never {
    throw new Error('Forgot to wrap component in `AuthProvider`')
  },
})

export const useAuthContext = (): AuthContextType => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)

  const handleSignIn = (user: { id: string; token: string }) => {
    dispatch({ type: 'SIGN_IN', payload: { ...user } })
  }

  const handleSignOut = () => {
    dispatch({ type: 'SIGN_OUT' })
  }

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      handleSignIn,
      handleSignOut,
    }),
    [state, dispatch],
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
