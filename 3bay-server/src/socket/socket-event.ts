import { ProductRes } from '../types/ProductRes.js'

export enum SocketEvent {
  AUCTION_NOTIFY = 'auction_notify',
  AUCTION_UPDATE = 'auction_update',
  CATEGORY_UPDATE = 'category_update',
  CONNECT = 'connection',
  DISCONNECT = 'disconnect',
  PRODUCT_UPDATE = 'product_update',
  SUBSCRIBE_AUCTION = 'subscribe_auction',
  SUBSCRIBE_PRODUCT = 'subscribe_product',
  USER_LOGOUT = 'user_logout',
  WHO_AM_I = 'whoami',
}

export type NotifyData = {
  type:
    | 'AUCTION_NEW_BID'
    | 'AUCTION_BID_REJECTED'
    | 'AUCTION_CLOSED_NO_WINNER'
    | 'AUCTION_CLOSED_HAD_WINNER'
    | 'BID_REQUEST_ACCEPTED'
    | 'BID_REQUEST_REJECTED'
  data: ProductRes
  date: Date
}
