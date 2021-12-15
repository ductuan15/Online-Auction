import axiosApiInstance from './api'
import { SignUpFormInputs } from '../data/sign-up'
import TokenService from './token.service'

export type AuthData = {
  user: string,
  token: string,
  refreshToken: string,
  role: string
}

async function signIn(email: string, pwd: string): Promise<AuthData> {
  const response = await axiosApiInstance.post('/auth/signin', {
    email,
    pwd,
  })
  // if (response.data) {
  //   TokenService.saveAuthData(response.data)
  // }
  return response.data as AuthData
}

function signOut() {
  TokenService.revokeAuthData()
}

async function register(user: SignUpFormInputs): Promise<string> {
  const response = await axiosApiInstance.post('/auth/signup', user)
  return response.data as string
}

const AuthService = {
  signIn,
  signOut,
  register,
}
export default AuthService
