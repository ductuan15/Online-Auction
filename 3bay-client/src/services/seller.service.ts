import axiosApiInstance from './api'
import Product, { CreateProductResponse } from '../models/product'
import { AxiosResponse } from 'axios'

async function addNewProduct(
  formData: FormData,
): Promise<AxiosResponse<CreateProductResponse>> {
  const headerConfig = {
    headers: { 'content-type': 'multipart/form-data' },
  }

  return await axiosApiInstance.post<CreateProductResponse>(
    '/api/product',
    formData,
    headerConfig,
  )
}

async function getAllPostedProduct(): Promise<AxiosResponse<Product[]>> {
  return await axiosApiInstance.get(`api/product/postedProducts`)
}

const SellerService = {
  addNewProduct,
  getAllPostedProduct
}

export default SellerService
