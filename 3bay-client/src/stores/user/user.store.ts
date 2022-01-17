import { UpgradeToSellerRequest, UserDetails } from '../../models/user'
import Product from '../../models/product'
import { NotifyData } from '../../models/notification'

const MAX_NOTIFICATIONS = 20

export type UserState = {
  userDetails?: UserDetails
  watchlist: Product[]
  notifyList: NotifyData[]
  unreadNotifications: number
  latestUnreadNotification?: NotifyData
}

export type UserAction =
  | { type: 'GET_ACCOUNT_INFO'; payload: UserDetails | undefined }
  | { type: 'UPGRADE_TO_SELLER_REQUEST'; payload: UpgradeToSellerRequest }
  | { type: 'UPDATE_WATCH_LIST'; payload: Product[] }
  | { type: 'ADD_WATCH_LIST'; payload: Product }
  | { type: 'DELETE_WATCH_LIST'; payload: number }
  | { type: 'ADD_NOTIFICATION'; payload: NotifyData }
  | { type: 'READ_NOTIFICATIONS' }
  | { type: 'CLOSE_RECENT_NOTIFICATION' }

export const initialUserState: UserState = {
  //
  watchlist: [],
  notifyList: [],
  unreadNotifications: 0,
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
        notifyList: !action.payload?.notifications ? [] : action.payload.notifications,
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
      const newNotifyList = [action.payload, ...state.notifyList]
      if (newNotifyList.length > MAX_NOTIFICATIONS) {
        newNotifyList.shift()
      }
      // console.log(newNotifyList)
      return {
        ...state,
        notifyList: newNotifyList,
        unreadNotifications: state.unreadNotifications + 1,
        latestUnreadNotification: action.payload,
      }
    }
    case 'READ_NOTIFICATIONS':
      return {
        ...state,
        unreadNotifications: 0,
      }
    case 'CLOSE_RECENT_NOTIFICATION':
      return {
        ...state,
        latestUnreadNotification: undefined,
        unreadNotifications:
          state.unreadNotifications > 0 ? state.unreadNotifications - 1 : 0,
      }
    default:
      return state
  }
}
