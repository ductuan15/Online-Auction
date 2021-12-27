import Product from '../../data/product'

export type ProductState = {
  currentProduct?: Product
}

export type ProductAction =
  { type: 'UPDATE_CURRENT_PRODUCT'; payload: Product }

export const initialProductState: ProductState = {
  currentProduct: undefined,
}

export const ProductReducer = (
  state: ProductState,
  action: ProductAction,
): ProductState => {
  switch (action.type) {
    case 'UPDATE_CURRENT_PRODUCT':
      return {
        ...state,
        currentProduct: action.payload,
      }
    default:
      return state
  }
}