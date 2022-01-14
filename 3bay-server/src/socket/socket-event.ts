import Prisma from '@prisma/client'
import { ProductRes } from '../types/ProductRes.js'

export enum SocketEvent {
  AUCTION_UPDATE = 'auction_update',
  AUCTION_NOTIFY = 'auction_notify',
}

export type NotifyData =
  | { type: 'AUCTION_NEW_BID'; data: ProductRes; date: Date }
  | { type: 'AUCTION_BID_REJECTED'; data: ProductRes; date: Date }
  | { type: 'AUCTION_CLOSED_NO_WINNER'; data: ProductRes; date: Date }
  | { type: 'AUCTION_CLOSED_HAD_WINNER'; data: ProductRes; date: Date }
