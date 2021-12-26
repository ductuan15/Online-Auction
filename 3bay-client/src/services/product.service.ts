import Product from '../data/product'
import axiosApiInstance from './api'

export const SORT_TYPE = {
  DESC: 'desc',
  ASC: 'asc',
}
const productApi = 'api/product'

export async function searchProduct(key: string, page: number, priceSortType:keyof typeof SORT_TYPE, closeTimeSortType: keyof typeof SORT_TYPE) {
  const response = await axiosApiInstance.get<Product[]>(
    `${productApi}/search`,
    {
      params: {
        key,
        page,
        priceOrder:priceSortType,
        timeOrder: closeTimeSortType
      },
    },
  )
  return response
}

export async function getProductById(id: number) {
  const response = await axiosApiInstance.get<Product>(
    `${productApi}/${id}?isWithDescription=true`,
  )
  console.log(response.data)
  return response
}

export const getTop = {
  async getTopPrice() {
    const response = await axiosApiInstance.get<Product[]>(
      `${productApi}/top/price`,
    )
    return response
  },
}
