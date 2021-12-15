import { createContext, ReactNode, useContext } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import AuthService, { AuthData } from '../../services/auth.service'

type AuthProviderProps = {
  children: ReactNode
}

type AuthContextType = {
  isAuth: boolean
  user?: AuthData
  signIn: (email: string, pwd: string, callback: VoidFunction) => void
  signOut: (callback: VoidFunction) => void
}

const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  signIn: (): never => {
    throw new Error('Forgot to wrap component in `AuthProvider`')
  },
  signOut: (): never => {
    throw new Error('Forgot to wrap component in `AuthProvider`')
  },
})

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useLocalStorage<AuthData | undefined>(
    'auth',
    undefined,
  )
  const isAuth = !!user

  const signIn = async (email: string, pwd: string, cb: VoidFunction) => {
    const user = await AuthService.signIn(email, pwd)
    setUser(user)
    cb()
  }

  const signOut = (cb: VoidFunction) => {
    setUser(undefined)
    cb()
  }

  const contextValue = {
    isAuth,
    user,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
