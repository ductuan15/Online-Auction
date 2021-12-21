import axiosApiInstance from './api'
import { SignUpFormInputs } from '../data/sign-up'
import TokenService from './token.service'
import {ChangeEmailForm} from '../pages/user/auth/ChangeEmail'
import {UserDetails} from '../data/user'

export type AuthData = {
  user: string
  token: string
  refreshToken: string
  role: string
  name: string
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

async function startVerifyingProcess(id: string): Promise<unknown> {
  return await axiosApiInstance.get(`/auth/verify/${id}`)
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

async function resendVerifyOTP(id: string): Promise<void> {
  await axiosApiInstance.get(`/auth/verify/resend/${id}`)
}

async function checkEmailBeforeResetPassword(email: string): Promise<void> {
  //console.log('axios email', email)
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

async function startChangingEmail(email: string): Promise<void> {
  // const authData = TokenService.getAuthData()
  if (email /*&& authData*/) {
    await axiosApiInstance.post(`/auth/change-email/`, {
      email
    })
  }
}

async function resendChangeEmailOTP(): Promise<void> {
  await axiosApiInstance.post('auth/change-email/resend')
}

async function verifyNewEmail(data: ChangeEmailForm): Promise<UserDetails> {
  const response = await axiosApiInstance.post(`/auth/change-email/verify/`, data)
  return response.data as UserDetails
}

const AuthService = {
  signIn,
  signOut,
  register,
  startVerifyingProcess,
  verify,
  resendVerifyOTP,
  checkEmailBeforeResetPassword,
  resetPassword,
  resendResetPasswordOTP,
  startChangingEmail,
  resendChangeEmailOTP,
  verifyNewEmail,
}
export default AuthService
