import axiosApiInstance from './api'
import Product, { CreateProductResponse } from '../models/product'
import { AxiosResponse } from 'axios'
import { BidRequest } from '../models/bidder'

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

async function getBidRequests(auctionId: number): Promise<BidRequest[]> {
  if (isNaN(auctionId)) {
    return []
  }
  const response = await axiosApiInstance.get<
    {
      users: {
        name: string
        uuid: string
      }
    }[]
  >(`api/auction/seller/bidRequest/${auctionId}`)

  return response.data.map((item) => ({
    id: item.users.uuid,
    name: item.users.name,
  }))
}

const SellerService = {
  addNewProduct,
  getAllPostedProduct,
  getBidRequests,
}

export default SellerService
