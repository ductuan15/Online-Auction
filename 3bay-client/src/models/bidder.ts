export type BidStatus = {
  status: 'NOT_BID' | 'ACCEPT' | 'PENDING' | 'REJECT'
}

export type BidRequest = {
    name: string
    id: string

}
