import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { useLocalStorage } from 'usehooks-ts'
import AuthService, { AuthData } from '../../services/auth.service'
import { UserDetails } from '../../models/user'

type AuthProviderProps = {
  children: ReactNode
}

export type AuthContextType = {
  isAuth: boolean
  user?: AuthData
  signIn: (email: string, pwd: string, callback: VoidFunction) => void
  signOut: (callback: VoidFunction) => void
  verify: (id: string, otp: string, callback: VoidFunction) => void
  resetPassword: (
    email: string,
    pwd: string,
    otp: string,
    cb: VoidFunction,
  ) => void
  updateUserInfo: (data: UserDetails) => void
}

const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  signIn: (): never => {
    throw new Error('Forgot to wrap component in `AuthProvider`')
  },
  signOut: (): never => {
    throw new Error('Forgot to wrap component in `AuthProvider`')
  },
  verify: (): never => {
    throw new Error('Forgot to wrap component in `AuthProvider`')
  },
  resetPassword: (): never => {
    throw new Error('Forgot to wrap component in `AuthProvider`')
  },
  updateUserInfo: (): never => {
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

  const signIn = useCallback(
    async (email: string, pwd: string, cb: VoidFunction) => {
      const user = await AuthService.signIn(email, pwd)
      //console.log(user)
      setUser(user)
      cb()
    },
    [setUser],
  )

  const signOut = useCallback(
    (cb: VoidFunction) => {
      setUser(undefined)
      cb()
    },
    [setUser],
  )

  const verify = useCallback(
    async (id: string, otp: string, cb: VoidFunction) => {
      // the response data is expected to be the same with sign-in case
      const user = await AuthService.verify(id, otp)
      //console.log(user)
      setUser(user)
      cb()
    },
    [setUser],
  )

  const resetPassword = useCallback(
    async (email: string, pwd: string, otp: string, cb: VoidFunction) => {
      // the response data is expected to be the same with sign-in case
      const user = await AuthService.resetPassword(email, pwd, otp)
      //console.log(user)
      setUser(user)
      cb()
    },
    [setUser],
  )

  const updateUserInfo = useCallback(
    (data: UserDetails) => {
      if (user && data) {
        setUser({
          ...user,
          name: data.name || user.name,
          role: data.role || user.role,
        })
      }
    },
    [setUser, user],
  )

  const contextValue = useMemo(() => {
    return {
      isAuth,
      user,
      signIn,
      signOut,
      verify,
      resetPassword,
      updateUserInfo,
    }
  }, [isAuth, resetPassword, signIn, signOut, updateUserInfo, user, verify])

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
