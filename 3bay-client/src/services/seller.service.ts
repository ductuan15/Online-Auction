import axiosApiInstance from './api'
import Product, { CreateProductResponse } from '../models/product'
import { AxiosResponse } from 'axios'
import { BidRequest, BidRequestResponseType } from '../models/bidder'
import { Auction } from '../models/auctions'

async function addNewProduct(
  formData: FormData,
): Promise<AxiosResponse<CreateProductResponse>> {
  const headerConfig = {
    headers: { 'content-type': 'multipart/form-data' },
  }

  return await axiosApiInstance.post<CreateProductResponse>(
    '/api/product',
    formData,
    headerConfig,
  )
}

async function getAllPostedProduct(): Promise<AxiosResponse<Product[]>> {
  return await axiosApiInstance.get(`api/product/postedProducts`)
}

async function getAllAuctionHasWinner(): Promise<AxiosResponse<Product[]>> {
  return await axiosApiInstance.get(`api/auction/has-winner`)
}

async function getBidRequests(auctionId: number): Promise<BidRequest[]> {
  if (isNaN(auctionId)) {
    return []
  }
  const response = await axiosApiInstance.get<BidRequestResponseType[]>(
    `api/auction/seller/bidRequest/${auctionId}`,
  )

  return response.data.map((item) => ({
    id: item.user.uuid,
    name: item.user.name,
    bidId: item.user.bids[0].id,
  }))
}

async function acceptBid(
  auctionId: number | undefined,
  bidId: number | undefined,
): Promise<Auction | undefined> {
  if (!auctionId || !bidId || isNaN(auctionId) || isNaN(bidId)) {
    return undefined
  }
  const response = await axiosApiInstance.patch<Auction>(
    `api/bid/setAccepted/${auctionId}/${bidId}`,
  )
  return response.data
}

async function rejectBid(
  auctionId: number | undefined,
  bidId: number | undefined,
): Promise<Auction | undefined> {
  if (!auctionId || !bidId || isNaN(auctionId) || isNaN(bidId)) {
    return undefined
  }
  const response = await axiosApiInstance.patch<Auction>(
    `api/bid/setRejected/${auctionId}/${bidId}`,
  )
  return response.data
}

const SellerService = {
  addNewProduct,
  getAllPostedProduct,
  getBidRequests,
  acceptBid,
  rejectBid,
  getAllAuctionHasWinner
}

export default SellerService
