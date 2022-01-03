export type BidStatus = {
  status: 'NOT_BID' | 'ACCEPT' | 'PENDING' | 'REJECT'
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
