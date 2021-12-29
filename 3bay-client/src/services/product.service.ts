import Product from '../models/product'
import axiosApiInstance from './api'
import { AxiosResponse } from 'axios'

export const SORT_TYPE = {
  desc: 'desc',
  asc: 'asc',
}
export const SORT_BY = {
  closeTime: 'closeTime',
  currentPrice:'currentPrice'
}

export interface GetProductsResponse {
  items: Product[],
  hasNextPage: boolean,
  cursor: number
}
//Small limit for test purpose
export const PAGE_LIMIT = 2;
const productApi = 'api/product'

export async function searchProduct(
  key: string,
  page: number,
  categoryId: number | string, 
  sortBy: keyof typeof SORT_BY,
  sortType: keyof typeof SORT_TYPE,
): Promise<AxiosResponse<GetProductsResponse>> {
  console.log(categoryId);
  return await axiosApiInstance.get<GetProductsResponse>(`${productApi}/search`, {
    params: {
      key,
      page,
      categoryId: categoryId,
      sortBy,
      sortType,
      limit: PAGE_LIMIT,
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
