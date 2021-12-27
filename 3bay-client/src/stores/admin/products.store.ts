import Product, { AdminProductistResponse } from '../../data/product'

export type ProductsState = {
  products: Product[]
  productsTable: {
    page: number // count from 1
    limit: number
    total: number
  }
}

export type ProductsAction = { type: 'ADD_ALL'; payload: AdminProductistResponse }

export const initialProductsState: ProductsState = {
  products: [],
  productsTable: {
    page: 1,
    limit: 5,
    total: 0,
  },
}

export const productsReducer = (
  state: ProductsState,
  action: ProductsAction,
): ProductsState => {
  switch (action.type) {
    case 'ADD_ALL': {
      const { products, ...tableData } = action.payload
      return {
        ...state,
        products: products,
        productsTable: tableData,
      }
    }

    default:
      return state
  }
}