import axiosApiInstance from './api'
import { CreateProductResponse } from '../models/product'
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

const SellerService = {
  addNewProduct,
}

export default SellerService
