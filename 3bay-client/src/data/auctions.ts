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
  // Add later
  winningBid: any
  bid: any
}
