import { AuthData } from './auth.service'
import { UserDetails } from '../data/user'
import axiosApiInstance from './api'
import { Dispatch } from 'react'
import { UserAction } from '../stores/user/user.store'
import { AuthContextType } from '../contexts/user/AuthContext'

async function getUserInfo(authData?: AuthData): Promise<UserDetails> {
  const response = await axiosApiInstance.get(
    `/api/user/account/${authData?.user || ''}`,
  )
  return response.data as UserDetails
}

async function updateUserInfo(
  user: UserDetails,
  dispatch: Dispatch<UserAction>,
  context: AuthContextType,
): Promise<void> {
  const response = await axiosApiInstance.post(
    `api/user/account/${user.uuid}`,
    {
      ...user,
    },
  )
  const data = response.data as UserDetails
  dispatch({ type: 'GET_ACCOUNT_INFO', payload: response.data })
  if (data.name) {
    context.rename(data.name)
  }
}

const UserService = {
  getUserInfo,
  updateUserInfo,
}

export default UserService
