import Product, { AdminProductListResponse } from '../../models/product'

export type ProductsState = {
  products: Product[]
  productsTable: {
    page: number // count from 1
    limit: number
    total: number
  }
}

export type ProductsAction =
  | { type: 'ADD_ALL'; payload: AdminProductListResponse }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }

export const initialProductsState: ProductsState = {
  products: [],
  productsTable: {
    page: 1,
    limit: 10,
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
    case 'SET_PAGE':
      return {
        ...state,
        productsTable: {
          ...state.productsTable,
          page: action.payload,
        },
      }
    case 'SET_PAGE_SIZE':
      return {
        ...state,
        productsTable: {
          ...state.productsTable,
          limit: action.payload,
        },
      }
    default:
      return state
  }
}