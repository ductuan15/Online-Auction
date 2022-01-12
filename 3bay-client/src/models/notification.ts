import Product from './product'
import { Bid } from './bids'

export type NotifyData =
  | { type: 'AUCTION_NEW_BID'; data: Product }
  | { type: 'AUCTION_BID_REJECTED'; data: Bid }
  | { type: 'AUCTION_CLOSED_NO_WINNER'; data: Product }
  | { type: 'AUCTION_CLOSED_HAD_WINNER'; data: Product }
