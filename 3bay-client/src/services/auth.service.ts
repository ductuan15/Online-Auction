import axiosApiInstance from './api'
import { SignUpFormInputs } from '../data/sign-up'
import TokenService from './token.service'

export type AuthData = {
  user: string
  token: string
  refreshToken: string
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

async function verify(id: string, otp: string): Promise<AuthData> {
  const response = await axiosApiInstance.post(`/auth/verify/${id}`, {
    otp,
  })
  // if (response.data) {
  //   TokenService.saveAuthData(response.data)
  // }
  return response.data as AuthData
}

function signOut() {
  TokenService.revokeAuthData()
}

async function register(user: SignUpFormInputs): Promise<{uuid: string}> {
  const response = await axiosApiInstance.post('/auth/signup', user)
  return response.data
}

const AuthService = {
  signIn,
  signOut,
  register,
  verify,
}
export default AuthService
