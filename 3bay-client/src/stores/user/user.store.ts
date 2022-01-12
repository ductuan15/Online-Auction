import { UpgradeToSellerRequest, UserDetails } from '../../models/user'
import Product from '../../models/product'
import { NotifyData } from '../../models/notification'

const MAX_NOTIFICATIONS = 20

export type UserState = {
  userDetails?: UserDetails
  watchlist: Product[]
  notifyList: NotifyData[]
}

export type UserAction =
  | { type: 'GET_ACCOUNT_INFO'; payload: UserDetails | undefined }
  | { type: 'UPGRADE_TO_SELLER_REQUEST'; payload: UpgradeToSellerRequest }
  | { type: 'UPDATE_WATCH_LIST'; payload: Product[] }
  | { type: 'ADD_WATCH_LIST'; payload: Product }
  | { type: 'DELETE_WATCH_LIST'; payload: number }
  | { type: 'ADD_NOTIFICATION'; payload: NotifyData }

export const initialUserState: UserState = {
  //
  watchlist: [],
  notifyList: [],
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
        notifyList: !action.payload ? [] : state.notifyList,
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
          return product.id !== action.payload
        }),
      }
    case 'ADD_NOTIFICATION': {
      const newNotifyList = [...state.notifyList, action.payload]
      if (newNotifyList.length > MAX_NOTIFICATIONS) {
        newNotifyList.shift()
      }
      // console.log(newNotifyList)
      return {
        ...state,
        notifyList: newNotifyList,
      }
    }
    default:
      return state
  }
}
