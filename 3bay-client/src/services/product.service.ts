import Product, { EditProductFormInput } from '../models/product'
import axiosApiInstance from './api'
import { AxiosResponse } from 'axios'
import { Watchlist } from '../models/user'

export const SORT_TYPE = {
  desc: 'desc',
  asc: 'asc',
}
export const SORT_BY = {
  closeTime: 'closeTime',
  currentPrice: 'currentPrice',
}

export interface GetProductsResponse {
  items: Product[]
  hasNextPage: boolean
  cursor: number
}
//Small limit for test purpose
export const PAGE_LIMIT = 12
const productApi = 'api/product'

export async function searchProduct(
  key: string,
  page: number,
  categoryId: number | string,
  sortBy: keyof typeof SORT_BY,
  sortType: keyof typeof SORT_TYPE,
): Promise<AxiosResponse<GetProductsResponse>> {
  // console.log(categoryId)
  return await axiosApiInstance.get<GetProductsResponse>(
    `${productApi}/search`,
    {
      params: {
        key,
        page,
        categoryId: categoryId,
        sortBy,
        sortType,
        limit: PAGE_LIMIT,
      },
    },
  )
}

export async function getProductById(
  id: number,
): Promise<AxiosResponse<Product>> {
  // console.log(response.data)
  return await axiosApiInstance.get<Product>(
    `${productApi}/${id}?isWithDescription=true`,
  )
}

export async function updateProductById(
  id: number,
  data: EditProductFormInput,
): Promise<Product> {
  const response = await axiosApiInstance.patch<Product>(
    `${productApi}/${id}?isWithDescription=true`,
    data,
  )
  // console.log(response.data)
  return response.data
}

export const getTop: {
  getTopPrice(): Promise<Product[]>
  getTopCloseTime(): Promise<Product[]>
  getTopBidNum(): Promise<Product[]>
} = {
  async getTopPrice() {
    const res = await axiosApiInstance.get<Product[]>(`${productApi}/top/price`)
    return res.data
  },
  async getTopCloseTime() {
    const res = await axiosApiInstance.get<Product[]>(
      `${productApi}/top/closeTime`,
    )
    return res.data
  },
  async getTopBidNum() {
    const res = await axiosApiInstance.get<Product[]>(
      `${productApi}/top/bidNumber`,
    )
    return res.data
  },
}

export async function addToWatchList(
  id?: number,
): Promise<AxiosResponse<Watchlist>> {
  return await axiosApiInstance.post<Watchlist>(`api/watchlist/byUser/${id}`)
}

export async function deleteProdWatchList(
  id?: number,
): Promise<AxiosResponse<Watchlist>> {
  return await axiosApiInstance.delete<Watchlist>(`api/watchlist/byUser/${id}`)
}

export function getRelativeProductsFunction(
  categoryId: number,
  currentProductId: number,
) {
  return async function () {
    const response = await axiosApiInstance.get<GetProductsResponse>(
      `${productApi}/byCategory/${categoryId}?page=1&limit=5`,
    )
    return response.data.items.filter((product) => {
      if (product.id !== currentProductId) {
        return true
      }
      return false
    })
  }
}
