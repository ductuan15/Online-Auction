/* eslint-disable @typescript-eslint/no-unused-vars */
import { BidStatus } from '../models/bidder'

async function getPoint(uuid: string): Promise<number> {
  // const response = await axiosApiInstance.get('')
  return 0.0
}

async function getAuctionStatus(
  userId: string,
  auctionId: number,
): Promise<BidStatus> {
  // const response = await axiosApiInstance.get('api/')
  return { status: 'NOT_BID' }
}

const BidderService = {
  getPoint,
  getAuctionStatus
}

export default BidderService
