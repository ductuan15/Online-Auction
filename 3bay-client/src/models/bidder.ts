export type BidStatus = {
  status: 'NOT_BID' | 'ACCEPT' | 'PENDING' | 'REJECT'
  hasAutoBid: boolean
  maximumAutoBidPrice?: number
}

export type BidRequest = {
  name: string
  id: string
  bidId: number
}

export type BidRequestResponseType = {
  user: {
    name: string
    uuid: string
    bids: {
      id: number
    }[]
  }
}
