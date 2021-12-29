import axiosApiInstance from './api'
import { AdminUserDetail, AdminUserListResponse } from '../models/admin-user'
import { AddUserFormInputs } from '../models/sign-up'
import Product, { AdminProductListResponse } from '../models/product'

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
  const userResponse = await axiosApiInstance.get(
    `/api/admin/users/request-seller/`,
    {
      params: {
        page,
        limit,
      },
    },
  )
  return userResponse.data as AdminUserListResponse
}

async function updateUser(
  user: AdminUserDetail & {
    cancelUpgradeToSellerRequest?: boolean
  },
): Promise<AdminUserDetail> {
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

async function getProductList(
  page: number,
  limit: number,
): Promise<AdminProductListResponse> {
  const productResponse = await axiosApiInstance.get(`/api/admin/products/`, {
    params: {
      page,
      limit,
    },
  })
  return productResponse.data as AdminProductListResponse
}

async function removeProduct(product: Product): Promise<Product> {
  const productResponse = await axiosApiInstance.delete<Product>(
    `/api/admin/products/${product.id}`,
  )
  return productResponse.data
}

const AdminService = {
  getUserList,
  addUser,
  updateUser,
  deleteUser,
  getRequestSellerUserList,
  getProductList,
  removeProduct,
}

export default AdminService
