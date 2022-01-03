import Product from '../../models/product'
import { BidStatus } from '../../models/bidder'

export type ProductState = {
  currentProduct?: Product
  isBidDialogOpened: boolean
  bidStatus?: BidStatus
  point: number | undefined
}

export type ProductAction =
  | { type: 'UPDATE_CURRENT_PRODUCT'; payload: Product }
  | { type: 'UPDATE_BID_STATUS'; payload?: BidStatus }
  | { type: 'OPEN_BID_DIALOG' }
  | { type: 'CLOSE_BID_DIALOG' }
  | { type: 'UPDATE_POINT'; payload: number }

export const initialProductState: ProductState = {
  isBidDialogOpened: false,
  point: 0
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
    case 'OPEN_BID_DIALOG':
      return {
        ...state,
        isBidDialogOpened: true,
      }
    case 'CLOSE_BID_DIALOG':
      return {
        ...state,
        isBidDialogOpened: false,
      }
    case 'UPDATE_BID_STATUS':
      return {
        ...state,
        bidStatus: action.payload
      }
    case 'UPDATE_POINT':
      return {
        ...state,
        point: action.payload
      }
    default:
      return state
  }
}