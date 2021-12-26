import axiosApiInstance from './api'
import { AdminUserDetail, AdminUserListResponse } from '../data/admin-user'
import { AddUserFormInputs } from '../data/sign-up'

async function getUserList(
  page: number,
  limit: number,
): Promise<AdminUserListResponse> {
  const userResponse = await axiosApiInstance.get(`/api/admin/users/`, {
    params: {
      page,
      limit,
    },
  })
  return userResponse.data as AdminUserListResponse
}

async function getRequestSellerUserList(
  page: number,
  limit: number,
): Promise<AdminUserListResponse> {
  const userResponse = await axiosApiInstance.get(`/api/admin/users/request-seller/`, {
    params: {
      page,
      limit,
    },
  })
  return userResponse.data as AdminUserListResponse
}

async function updateUser(user: AdminUserDetail & {
  cancelUpgradeToSellerRequest?: boolean
}): Promise<AdminUserDetail> {
  const userResponse = await axiosApiInstance.patch(`/api/admin/users/`, {
    ...user,
  })
  return userResponse.data as AdminUserDetail
}

async function addUser(user: AddUserFormInputs): Promise<{ uuid: string }> {
  const userResponse = await axiosApiInstance.post(`/api/admin/users/`, user)
  return userResponse.data as { uuid: string }
}

async function deleteUser(user: AdminUserDetail): Promise<AdminUserDetail> {
  const userResponse = await axiosApiInstance.delete(
    `/api/admin/users/${user.uuid}`,
  )
  return userResponse.data as AdminUserDetail
}

const AdminUserService = {
  getUserList,
  addUser,
  updateUser,
  deleteUser,
  getRequestSellerUserList,
}

export default AdminUserService
