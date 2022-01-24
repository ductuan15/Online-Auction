import { UpgradeToSellerRequest, UserDetails } from '../models/user'
import axiosApiInstance from './api'
import { Dispatch } from 'react'
import { UserAction } from '../stores/user/user.store'
import { AuthContextType } from '../contexts/user/AuthContext'
import { PasswordFormType } from '../pages/user/profile/Password'
import { AxiosResponse } from 'axios'
import Product from "../models/product";

async function getUserInfo(authData?: Partial<{user: string}>): Promise<UserDetails> {
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
    user,
  )
  const data = response.data as UserDetails
  dispatch({ type: 'GET_ACCOUNT_INFO', payload: response.data })
  if (data.name) {
    context.updateUserInfo(data)
  }
}

async function changePassword(
  user: UserDetails,
  data: PasswordFormType,
): Promise<AxiosResponse<UserDetails>> {
  return await axiosApiInstance.post(`api/user/password/${user.uuid}`, data)
}

async function upgradeToSeller(): Promise<UpgradeToSellerRequest> {
  const response = await axiosApiInstance.post(`api/user/request-to-seller`)
  return response.data as UpgradeToSellerRequest
}

async function getUserWatchList(): Promise<Product[]> {
  const response = await axiosApiInstance.get(`api/watchlist/byUser`)
  return response.data as Product[]
}

async function getUserAuctionList(): Promise<Product[]> {
  const response = await axiosApiInstance.get(`api/auction/joined`)
  return response.data as Product[]
}

async function getUserWonAuctionList(): Promise<Product[]> {
  const response = await axiosApiInstance.get(`api/auction/won`)
  return response.data as Product[]
}


async function getPoint(uuid?: string): Promise<number | undefined> {
  const response = await axiosApiInstance.get<{
    score: number
  }>(`/api/user/score/${uuid}`)
  return response.data.score
}


const UserService = {
  getUserInfo,
  updateUserInfo,
  changePassword,
  upgradeToSeller,
  getUserWatchList,
  getUserAuctionList,
  getUserWonAuctionList,
  getPoint,
}

export default UserService
