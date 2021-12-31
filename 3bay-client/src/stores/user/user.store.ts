import { UpgradeToSellerRequest, UserDetails } from '../../models/user'
import Product from "../../models/product";

export type UserState = {
  userDetails?: UserDetails,
  watchlist: Product[]
}

export type UserAction =
  | { type: 'GET_ACCOUNT_INFO'; payload: UserDetails | undefined }
  | { type: 'UPGRADE_TO_SELLER_REQUEST'; payload: UpgradeToSellerRequest }
  | { type: 'UPDATE_WATCH_LIST'; payload: Product[] }
  | { type: 'ADD_WATCH_LIST'; payload: Product }
  | { type: 'DELETE_WATCH_LIST'; payload: number }
export const initialUserState = {
  //
  watchlist: []
}

export const userReducer = (
  state: UserState,
  action: UserAction,
): UserState => {
  switch (action.type) {
    case 'GET_ACCOUNT_INFO':
      return {
        ...state,
        userDetails: action.payload,
      }
    case 'UPGRADE_TO_SELLER_REQUEST': {
      let newData = state.userDetails
      if (state.userDetails) {
        newData = {
          ...state.userDetails,
          upgradeToSellerRequest: action.payload,
        }
      }
      return {
        ...state,
        userDetails: newData,
      }
    }
    case 'UPDATE_WATCH_LIST':
      return {
        ...state,
        watchlist: action.payload,
      }
    case 'ADD_WATCH_LIST':
      return {
        ...state,
        watchlist: [...state.watchlist, action.payload],
      }
    case 'DELETE_WATCH_LIST':
      return {
        ...state,
        watchlist: state.watchlist.filter((product: Product) => {
          if (product.id === action.payload) {
            return false
          } else return true
        }),
      }
    default:
      return state
  }
}


