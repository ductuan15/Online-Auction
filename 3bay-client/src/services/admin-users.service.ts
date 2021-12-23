import axiosApiInstance from './api'
import { AdminUserListResponse } from '../data/admin-user'

async function getUserList(page: number, limit: number): Promise<AdminUserListResponse> {
  const userResponse = await axiosApiInstance.get(`/api/admin/users/`, {
    params: {
      page,
      limit,
    },
  })
  return userResponse.data as AdminUserListResponse
}

const AdminUserService = {
  getUserList
}

export default AdminUserService