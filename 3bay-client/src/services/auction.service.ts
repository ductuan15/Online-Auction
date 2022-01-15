import { Auction } from '../models/auctions'
import axiosApiInstance from './api'
import { ProductBidFormInput } from '../models/bids'
import { AxiosResponse } from 'axios'
import { BidderComment, SellerComment } from '../models/user'

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

async function newAutoBid(
  auctionId: number,
  maximumPrice: number,
): Promise<Auction> {
  const response = await axiosApiInstance.post<Auction>(
    `/api/bid/auto/${auctionId}`,
    {
      bidPrice: maximumPrice,
    },
  )
  return response.data
}

async function addSellerReview(
  productId: number,
  payload: SellerComment,
): Promise<AxiosResponse> {
  // console.log(productId)
  // console.log(payload)
  return await axiosApiInstance.patch(
    `/api/auction/seller/review/${productId}`,
    payload,
  )
}

async function addBidderReview(
  productId: number,
  payload: BidderComment,
): Promise<AxiosResponse> {
  // console.log(productId)
  // console.log(payload)
  return await axiosApiInstance.patch<Auction>(
    `/api/auction/bidder/review/${productId}`,
    payload,
  )
}

const AuctionService = {
  newBid,
  addSellerReview,
  addBidderReview,
  newAutoBid,
}

export default AuctionService
