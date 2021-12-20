import {AuthData} from './auth.service'
import {UserDetails} from '../data/user'
import axiosApiInstance from './api'

async function getUserInfo(authData?: AuthData): Promise<UserDetails> {
  const response = await axiosApiInstance.get(`/api/user/account/${authData?.user || ''}`)
  return response.data
}

const UserService = {
  getUserInfo
}

export default UserService