import Product from '../../models/product'
import { BidStatus } from '../../models/bidder'
import { Auction } from '../../models/auctions'

export type ProductState = {
  currentProduct?: Product
  latestAuction?: Auction
  isBidDialogOpened: boolean
  bidStatus?: BidStatus
  // TODO move userPoint to userContext or somewhere else
  userPoint: number | undefined
  sellerPoint: number | undefined
  winningBidderPoint: number | undefined
}

export type ProductAction =
  | { type: 'UPDATE_CURRENT_PRODUCT'; payload: Product }
  | { type: 'UPDATE_BID_STATUS'; payload?: BidStatus }
  | { type: 'OPEN_BID_DIALOG' }
  | { type: 'CLOSE_BID_DIALOG' }
  | { type: 'UPDATE_USER_POINT'; payload?: number }
  | { type: 'UPDATE_SELLER_POINT'; payload?: number }
  | { type: 'UPDATE_WINNING_BIDDER_POINT'; payload?: number }
  | { type: 'UPDATE_AUCTION'; payload?: Auction }

export const initialProductState: ProductState = {
  isBidDialogOpened: false,
  userPoint: undefined,
  sellerPoint: undefined,
  winningBidderPoint: undefined,
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
        latestAuction: action.payload.latestAuction,
      }
    case 'UPDATE_AUCTION':
      return {
        ...state,
        latestAuction: action.payload,
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
        bidStatus: action.payload,
      }
    case 'UPDATE_USER_POINT':
      return {
        ...state,
        userPoint: action.payload,
      }
    case 'UPDATE_WINNING_BIDDER_POINT':
      return {
        ...state,
        winningBidderPoint: action.payload,
      }
    case 'UPDATE_SELLER_POINT':
      return {
        ...state,
        sellerPoint: action.payload,
      }
    default:
      return state
  }
}