export type ProductBidFormInput = {
  auctionId: number,
  bidPrice: number,
  score: number,
  step: string,
}

export type Bid = {
  id: number
  bidPrice: number,
  bidTime: number,
  bidComment: string,
  bidderId: string,
  auctionId: number,
  status: 'ACCEPT' | 'PENDING' | 'REJECT'
}