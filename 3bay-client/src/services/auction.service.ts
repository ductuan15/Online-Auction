import { Auction } from '../models/auctions'
import axiosApiInstance from './api'
import { ProductBidFormInput } from '../models/bids'
import { CreateProductResponse } from '../models/product'

async function newBid(
  bidInput: ProductBidFormInput,
): Promise<Auction | undefined> {
  if (isNaN(bidInput.auctionId)) {
    return undefined
  }
  const response = await axiosApiInstance.post<Auction>(
    `/api/bid/${bidInput.auctionId}`,
    bidInput,
  )
  return response.data
}

async function addSellerReview(
  productId: number,
  payload: any,
): Promise<Auction> {
  console.log(productId)
  console.log(payload)
  const response = await axiosApiInstance.patch<Auction>(
    `/api/auction/seller/review/${productId}`,
    payload,
  )
  return response.data
}

async function addBidderReview(
  productId: number,
  payload: any,
): Promise<Auction> {
  console.log(productId)
  console.log(payload)
  const response = await axiosApiInstance.patch<Auction>(
    `/api/auction/bidder/review/${productId}`,
    payload,
  )
  return response.data
}

const AuctionService = {
  newBid,
  addSellerReview,
  addBidderReview
}

export default AuctionService
