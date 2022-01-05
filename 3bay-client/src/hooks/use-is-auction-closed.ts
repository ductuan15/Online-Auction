import { Auction } from '../models/auctions'
import { useMemo } from 'react'
import moment from 'moment'

export function useIsAuctionClosed(latestAuction?: Auction) {
  return useMemo(() => {
    return (
      latestAuction &&
      latestAuction.closeTime &&
      moment(latestAuction.closeTime).isBefore()
    )
  }, [latestAuction])
}