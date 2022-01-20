import { ProductRes } from '../types/ProductRes.js'

export enum SocketEvent {
  AUCTION_UPDATE = 'auction_update',
  AUCTION_NOTIFY = 'auction_notify',
  USER_LOGOUT = 'user_logout',
  CATEGORY_UPDATE = 'category_update',
}

export type NotifyData = {
  type:
    | 'AUCTION_NEW_BID'
    | 'AUCTION_BID_REJECTED'
    | 'AUCTION_CLOSED_NO_WINNER'
    | 'AUCTION_CLOSED_HAD_WINNER'
  data: ProductRes
  date: Date
}
