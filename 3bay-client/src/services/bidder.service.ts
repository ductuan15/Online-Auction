import { BidStatus } from '../models/bidder'
import axiosApiInstance from './api'

async function getAuctionStatus(auctionId: number): Promise<BidStatus> {
  const response = await axiosApiInstance.get<BidStatus>(
    `/api/auction/userStatus/${auctionId}`,
  )
  return response.data
}

async function requestBidPermission(auctionId: number): Promise<BidStatus> {
  const response = await axiosApiInstance.post<BidStatus>(
    `/api/auction/userStatus/${auctionId}`,
  )
  return response.data
}

const BidderService = {
  getAuctionStatus,
  requestBidPermission,
}

export default BidderService
