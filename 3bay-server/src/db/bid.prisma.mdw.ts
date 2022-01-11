import { extendAuctionTime } from '../controllers/auction.controller.js'
import Prisma from '@prisma/client'

const bidMdw: Prisma.Prisma.Middleware<any> = async (param, next) => {

  if (param.model === 'Bid') {
    if (
      param.action === 'update' ||
      param.action === 'create' ||
      param.action === 'upsert'
    ) {
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
    } else if (param.action === 'updateMany' || param.action === 'createMany') {
      const results = await next(param)
      try {
        if (
          results &&
          results.length &&
          results.length !== 0 &&
          results[0].auctionId
        ) {
          await extendAuctionTime(results[0].auctionId)
        }
      } catch (e) {
        console.log(param)
        console.log(e)
      }
      return results
    } else {
      return await next(param)
    }
  } else {
    return await next(param)
  }
}

export default bidMdw
