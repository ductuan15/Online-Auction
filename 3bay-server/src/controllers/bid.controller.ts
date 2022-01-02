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
      +req.body.bidPrice >=
        req.auction?.currentPrice
          .add(req.auction?.incrementPrice || 0)
          .toNumber()
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

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.body.score
      ? Prisma.BidStatus.ACCEPTED
      : Prisma.BidStatus.PENDING
    const [bid] = await prisma.$transaction([
      prisma.bid.create({
        data: {
          auctionId: req.auction?.id || NaN,
          bidderId: req.user?.uuid || '',
          bidPrice: req.body.bidPrice,
        },
      }),
      prisma.userBidStatus.upsert({
        where: {
          auctionId_userId: {
            auctionId: req.auction?.id || NaN,
            userId: req.user?.uuid || '',
          },
        },
        update: {
          status: status,
        },
        create: {
          auctionId: req.auction?.id || NaN,
          userId: req.user?.uuid || '',
          status: status,
        },
      }),
    ])
    if (status === Prisma.BidStatus.ACCEPTED) {
      req.bid = bid
      next()
    } else {
      res.json(req.auction)
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
    await prisma.userBidStatus.update({
      where: {
        auctionId_userId: {
          auctionId: req.auction?.id || NaN,
          userId: req.bid?.bidderId || '',
        },
      },
      data: {
        status: Prisma.BidStatus.ACCEPTED,
      },
    })
    next()
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
    await prisma.userBidStatus.update({
      where: {
        auctionId_userId: {
          auctionId: req.auction?.id || NaN,
          userId: req.bid?.bidderId || '',
        },
      },
      data: {
        status: Prisma.BidStatus.REJECTED,
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
        id: {
          not: req.auction?.winningBidId || NaN,
        },
        auction: {
          UserBidStatus: {
            none: {
              userId: req.bid?.bidderId,
              auctionId: req.auction?.id,
              status: Prisma.BidStatus.REJECTED,
            },
          },
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
    if (
      req.auction?.winningBidId === req.bid?.id ||
      req.bid?.bidPrice.greaterThanOrEqualTo(
        req.auction?.currentPrice.add(req.auction?.incrementPrice || 0) || 0,
      )
    ) {
      next()
    } else {
      res.json(req.auction)
    }
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const checkUserBidStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userBidStatus = await prisma.userBidStatus.findUnique({
      where: {
        auctionId_userId: {
          auctionId: req.auction?.id || NaN,
          userId: req.user?.uuid || '',
        },
      },
    })
    if (userBidStatus?.status === Prisma.BidStatus.PENDING)
      throw new BidError({ code: BidErrorCode.HavingPendingBid })
    else if (userBidStatus?.status === Prisma.BidStatus.REJECTED)
      throw new BidError({ code: BidErrorCode.InBlacklist })
    else {
      next()
    }
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}
export const isSelfBid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: req.auction?.productId,
      },
    })
    if (product?.sellerId === req.user?.uuid) {
      throw new BidError({ code: BidErrorCode.SelfBid })
    } else {
      next()
    }
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}


export const isWinningBidder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const winningBid = await prisma.bid.findUnique({
      where: {
        id: req.auction?.winningBidId || 0,
      },
      include:{
        bidder:{
          select: {
            uuid: true
          }
        }
      }
    })
    if (winningBid?.bidder.uuid === req.user?.uuid) {
      throw new BidError({ code: BidErrorCode.AlreadyWinningAuction })
    } else {
      next()
    }
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}
