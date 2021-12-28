import Product from '../models/product'
import axiosApiInstance from './api'
import { AxiosResponse } from 'axios'

export const SORT_TYPE = {
  DESC: 'desc',
  ASC: 'asc',
}
const productApi = 'api/product'

export async function searchProduct(
  key: string,
  page: number,
  priceSortType: keyof typeof SORT_TYPE,
  closeTimeSortType: keyof typeof SORT_TYPE,
): Promise<AxiosResponse<Product[]>> {
  return await axiosApiInstance.get<Product[]>(`${productApi}/search`, {
    params: {
      key,
      page,
      priceOrder: priceSortType,
      timeOrder: closeTimeSortType,
    },
  })
}

export async function getProductById(
  id: number,
): Promise<AxiosResponse<Product>> {
  const response = await axiosApiInstance.get<Product>(
    `${productApi}/${id}?isWithDescription=true`,
  )
  console.log(response.data)
  return response
}

export const getTop: { getTopPrice(): Promise<AxiosResponse<Product[]>> } = {
  async getTopPrice() {
    return await axiosApiInstance.get<Product[]>(`${productApi}/top/price`)
  },
}
