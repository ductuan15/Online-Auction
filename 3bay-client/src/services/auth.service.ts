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

async function resendVerifyOTP(id: string) {
  await axiosApiInstance.get(`/auth/verify/resend/${id}`)
}

async function checkEmailBeforeResetPassword(email: string): Promise<void> {
  console.log('axios email', email)
  await axiosApiInstance.post('/auth/reset-pwd/request', {
    email,
  })
}

async function resendResetPasswordOTP(email: string): Promise<void> {
  await axiosApiInstance.post('auth/reset-pwd/resend', {
    email,
  })
}

async function resetPassword(
  email: string,
  pwd: string,
  otp: string,
): Promise<AuthData> {
  const response = await axiosApiInstance.post('auth/reset-pwd/', {
    email,
    pwd,
    otp,
  })
  return response.data as AuthData
}

function signOut(): void {
  TokenService.revokeAuthData()
}

async function register(user: SignUpFormInputs): Promise<{ uuid: string }> {
  const response = await axiosApiInstance.post('/auth/signup', user)
  return response.data
}

const AuthService = {
  signIn,
  signOut,
  register,
  verify,
  resendVerifyOTP,
  checkEmailBeforeResetPassword,
  resetPassword,
  resendResetPasswordOTP,
}
export default AuthService
