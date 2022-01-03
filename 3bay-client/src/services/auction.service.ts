import { Auction } from '../models/auctions'
import axiosApiInstance from './api'
import { ProductBidFormInput } from '../models/bids'

async function newBid(bidInput: ProductBidFormInput): Promise<Auction | undefined> {
  if (isNaN(bidInput.auctionId)) {
    return undefined
  }
  const response = await axiosApiInstance.post<Auction>(
    `/api/bid/${bidInput.auctionId}`, bidInput
  )
  return response.data
}

const AuctionService = {
  newBid,
}

export default AuctionService
