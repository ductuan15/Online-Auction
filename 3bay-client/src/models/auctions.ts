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
  bidderReview: boolean,
  bidderComment: string,
  sellerReview: boolean,
  sellerComment: string,

  _count: {
    bids: number
  }
  winningBid?: Bid
  bids: Bid[]
}
