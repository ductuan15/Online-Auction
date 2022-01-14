import Product from './product'

export type NotifyData =
  | { type: 'AUCTION_NEW_BID'; data: Product; date: Date }
  | { type: 'AUCTION_BID_REJECTED'; data: Product; date: Date }
  | { type: 'AUCTION_CLOSED_NO_WINNER'; data: Product; date: Date }
  | { type: 'AUCTION_CLOSED_HAD_WINNER'; data: Product; date: Date }
