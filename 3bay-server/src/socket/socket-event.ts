import Prisma from '@prisma/client'

export enum SocketEvent {
  AUCTION_UPDATE = 'auction_update',
  AUCTION_NOTIFY = 'auction_notify',
}

export type NotifyData =
  | { type: 'AUCTION_NEW_BID'; data: Prisma.Product }
  | { type: 'AUCTION_BID_REJECTED'; data: Prisma.Bid }
  | { type: 'AUCTION_CLOSED_NO_WINNER'; data: Prisma.Product }
  | { type: 'AUCTION_CLOSED_HAD_WINNER'; data: Prisma.Product }
