import Prisma from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import { BidErrorCode } from '../error/error-code.js'
import { BidError } from '../error/error-exception.js'

const VALID_SCORE = 8
export const getWonAuction = async (userId: string) => {
  const userWonAuction = await prisma.auction.findMany({
    where: {
      winningBid: {
        bidderId: userId,
      },
      closeTime: {
        lt: new Date(),
      },
    },
  })
  return userWonAuction
}

export const getScore = async (userId: string) => {
  const userWonAuction = await getWonAuction(userId)
  if (userWonAuction.length === 0) {
    return undefined
  }
  let score = 0
  let wonAuction = 0
  userWonAuction.forEach((auction) => {
    if (auction.sellerReview) {
      score += +auction.sellerReview
      wonAuction++
    }
  })
  return score / wonAuction
}

export const isValidScore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const score = await getScore(req.user?.uuid || '')
    if (score && score <= VALID_SCORE) {
      throw new BidError({ code: BidErrorCode.InvalidScore })
    } else {
      req.body.score = score
    }
    next()
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const isValidBidAmount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.body.bidPrice)

    if (
      req.auction &&
      +(req.body.bidPrice || 0) >=
        req.auction.currentPrice.toNumber() +
          req.auction.incrementPrice.toNumber()
    ) {
      next()
    } else {
      throw new BidError({ code: BidErrorCode.InvalidBidAmount })
    }
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const isInBlacklist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rejectedBids = await prisma.bid.findFirst({
      where: {
        auction: {
          productId: req.auction?.productId,
        },
        bidderId: req.user?.uuid,
        status: Prisma.BidsStatus.REJECTED,
      },
    })
    if (rejectedBids) {
      throw new BidError({ code: BidErrorCode.InBlacklist })
    } else {
      next()
    }
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const isHavingPendingBids = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pendingBid = await prisma.bid.findFirst({
      where: {
        bidderId: req.user?.uuid,
        auctionId: req.auction?.id,
        status: Prisma.BidsStatus.PENDING,
      },
    })
    if (pendingBid) {
      throw new BidError({ code: BidErrorCode.HavingPendingBid })
    } else {
      next()
    }
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.score === undefined) {
      const expiredDate = new Date()
      expiredDate.setDate(expiredDate.getDate() + 1)
      const pendingBids = await prisma.bid.create({
        data: {
          auctionId: req.auction?.id || NaN,
          bidderId: req.user?.uuid || '',
          bidPrice: req.body.bidPrice,
          status: Prisma.BidsStatus.PENDING,
        },
      })
      res.json(pendingBids)
    } else {
      req.bid = await prisma.bid.create({
        data: {
          auctionId: req.auction?.id || NaN,
          bidderId: req.user?.uuid || '',
          status: Prisma.BidsStatus.ACCEPTED,
        },
      })
      next()
    }
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const setBidStatusToAccepted = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bid = await prisma.bid.update({
      where: {
        id: req.bid?.id,
      },
      data: {
        status: Prisma.BidsStatus.ACCEPTED,
      },
    })
    if (
      bid.bidPrice >=
      (req.auction?.currentPrice.add(req.auction?.incrementPrice || 0) || 0)
    ) {
      req.bid = bid
      next()
    } else {
      res.json(bid)
    }
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const isAuctionsClosed = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.auction?.closeTime && req.auction?.closeTime > new Date()) {
      next()
    } else {
      throw new BidError({ code: BidErrorCode.ClosedAuction })
    }
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const isProductOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await prisma.product.findFirst({
      where: {
        id: req.auction?.productId || NaN,
        sellerId: req.user?.uuid || '',
      },
      rejectOnNotFound: true,
    })
    next()
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}
export const setBidStatusToRejected = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.bid = await prisma.bid.update({
      where: {
        id: +(req.params.bidId || NaN),
      },
      data: {
        status: Prisma.BidsStatus.REJECTED,
      },
    })
    next()
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const getPrevWinningBid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const prevWinningBidPrice = await prisma.bid.aggregate({
      where: {
        auctionId: req.auction?.id || NaN,
        status: Prisma.BidsStatus.ACCEPTED,
        id: {
          notIn: req.auction?.winningBidId || 0,
        },
      },
      _max: {
        bidPrice: true,
      },
    })
    req.bid = await prisma.bid.findFirst({
      where: {
        auctionId: req.auction?.id || NaN,
        bidPrice: prevWinningBidPrice._max.bidPrice?.toNumber() || 0,
      },
    })
    next()
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const bidById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.bid = await prisma.bid.findFirst({
      where: {
        id: +(req.params.bidId || NaN),
        auctionId: req.auction?.id,
      },
      rejectOnNotFound: true,
    })
    next()
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const isWinningBid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.auction?.winningBidId === req.bid?.id) {
      next()
    } else {
      res.json(req.bid)
    }
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}
