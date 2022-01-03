import { Bidder } from './user'
import { Bid } from './bids'

export interface Auction {
  id: number
  startTime: Date
  closeTime: Date
  openPrice: number
  incrementPrice: number
  buyoutPrice: number
  autoExtendAuctionTiming: boolean
  currentPrice: number
  _count: {
    bids: number
  }
  winningBid?: Bidder
  bids: Bid[]
}
