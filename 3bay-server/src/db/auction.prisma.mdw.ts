import Prisma from '@prisma/client'
import prisma from './prisma.js'
import scheduler from '../services/auction.service.js'

const auctionMdw: Prisma.Prisma.Middleware = async (param, next) => {
  if (param.model === 'Auction') {
    switch (param.action) {
      case 'update':
      case 'create':
      case 'upsert': {
        const result = await next(param)
        try {
          await onAuctionChanged(result)
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
          await onAuctionsChanged(results)
        } catch (e) {
          console.log(param)
          console.log(e)
        }
        return results
      }
      case 'delete': {
        const result = await next(param)
        try {
          await onAuctionDeleted(result)
        } catch (e) {
          console.log(param)
          console.log(e)
        }
        return result
      }
      case 'deleteMany': {
        const results = await next(param)
        try {
          await onAuctionsDeleted(results)
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

async function onAuctionChanged(result: Partial<Prisma.Auction>) {
  if (result && result.id) {
    let closeTime = result.closeTime
    if (!closeTime) {
      closeTime = (
        await prisma.auction.findUnique({
          where: { id: result.id },
          select: { closeTime: true },
          rejectOnNotFound: true,
        })
      ).closeTime
    }
    scheduler.add(result.id, closeTime)
  }
}

async function onAuctionsChanged(results: Partial<Prisma.Auction>[]) {
  if (results && results.length) {
    for (const auction of results) {
      await onAuctionChanged(auction)
    }
  }
}

function onAuctionDeleted(result: Partial<Prisma.Auction>) {
  if (result && result.id) {
    scheduler.remove(result.id)
  }
}

function onAuctionsDeleted(results: Partial<Prisma.Auction>[]) {
  if (results && results.length) {
    for (const auction of results) {
      onAuctionDeleted(auction)
    }
  }
}

export default auctionMdw
