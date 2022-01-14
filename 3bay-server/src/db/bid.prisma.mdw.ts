import { extendAuctionTime } from '../controllers/auction.controller.js'
import Prisma from '@prisma/client'

const bidMdw: Prisma.Prisma.Middleware = async (param, next) => {
  if (param.model === 'Bid') {
    switch (param.action) {
      case 'update':
      case 'create':
      case 'upsert': {
        const result = await next(param)
        try {
          if (result.auctionId) {
            await extendAuctionTime(result.auctionId)
          }
        } catch (e) {
          console.log(param)
          console.log(e)
        }
        return result
      }
      case 'updateMany':
      case 'createMany': {
        const results = await next(param)
        try {
          if (results && results.length) {
            const auctionIdSet = new Set<number | undefined>(
              results.map((auction: Partial<{ auctionId: number }>) => {
                return auction.auctionId
              }),
            )
            for (const auctionIdSetElement of auctionIdSet) {
              if (auctionIdSetElement) {
                await extendAuctionTime(auctionIdSetElement)
              }
            }
          }
        } catch (e) {
          console.log(param)
          console.log(e)
        }
        return results
      }
    }
  }
  return await next(param)
}
export default bidMdw
