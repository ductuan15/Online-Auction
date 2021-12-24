import axiosApiInstance from './api'
import { AdminUserDetail, AdminUserListResponse } from '../data/admin-user'

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

async function updateUser(user: AdminUserDetail): Promise<AdminUserDetail> {
  const userResponse = await axiosApiInstance.post(`/api/admin/users/`, {
    ...user,
  })
  return userResponse.data as AdminUserDetail
}

const AdminUserService = {
  getUserList,
  updateUser
}

export default AdminUserService
