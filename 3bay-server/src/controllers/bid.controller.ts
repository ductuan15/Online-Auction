import Prisma from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import { BidErrorCode } from '../error/error-code.js'
import { BidError } from '../error/error-exception.js'

const VALID_SCORE = 8
export const getWonAuction = async (userId: string) => {
  return await prisma.auction.findMany({
    where: {
      winningBid: {
        bidderId: userId,
      },
      closeTime: {
        lt: new Date(),
      },
    },
  })
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
      score += 1
    }
    wonAuction++
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
      return next(new BidError({ code: BidErrorCode.InvalidScore }))
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
      return next()
    } else {
      return next(new BidError({ code: BidErrorCode.InvalidBidAmount }))
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
      return next()
    } else {
      return next(new BidError({ code: BidErrorCode.ClosedAuction }))
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
    if (userBidStatus?.status === Prisma.BidStatus.PENDING) {
      return next(new BidError({ code: BidErrorCode.HavingPendingBid }))
    } else if (userBidStatus?.status === Prisma.BidStatus.REJECTED) {
      return next(new BidError({ code: BidErrorCode.InBlacklist }))
    } else {
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
      return next(new BidError({ code: BidErrorCode.SelfBid }))
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
      include: {
        bidder: {
          select: {
            uuid: true,
          },
        },
      },
    })
    if (winningBid?.bidder.uuid === req.user?.uuid) {
      return next(new BidError({ code: BidErrorCode.AlreadyWinningAuction }))
    } else {
      next()
    }
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const addAutoBid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status = req.body.score
      ? Prisma.BidStatus.ACCEPTED
      : Prisma.BidStatus.PENDING
    await prisma.userBidStatus.upsert({
      update: {
        status: status,
      },
      create: {
        auctionId: req.auction?.id || NaN,
        userId: req.user.uuid,
        status: status,
      },
      where: {
        auctionId_userId: {
          auctionId: req.auction?.id || NaN,
          userId: req.user.uuid,
        },
      },
    })

    req.body.bidPrice = req.auction?.currentPrice.add(
      req.auction.incrementPrice,
    )
    next()
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const executeAutoBid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const autoBids = await prisma.autoBid.findMany({
      where: {
        auctionId: req.auction?.id || NaN,
        user: {
          userBidStatus: {
            some: {
              auctionId: req.auction?.id || NaN,
              status: Prisma.BidStatus.ACCEPTED,
            },
          },
        },
      },
      include: {
        auctions: true,
      },
    })
    // add auto bid to bid table
    const newBids: Prisma.Prisma.BidCreateManyInput[] = []
    let curWinningBider = req.bid?.bidderId
    let curWinningPrice = req.bid?.bidPrice
    while (true) {
      let isFoundNewWinner = false
      autoBids.forEach((autoBid) => {
        if (
          req.bid &&
          autoBid.maximumPrice.greaterThan(req.bid?.bidPrice) &&
          autoBid.userId !== curWinningBider
        ) {
          newBids.push({
            auctionId: req.bid.auctionId,
            bidPrice: curWinningPrice?.add(autoBid.auctions.incrementPrice),
            bidderId: autoBid.userId,
            bidTime: new Date(),
          })
          curWinningBider = autoBid.userId
          curWinningPrice = curWinningPrice?.add(
            autoBid.auctions.incrementPrice,
          )
          isFoundNewWinner = true
        }
      })
      if (!isFoundNewWinner) {
        break
      }
    }
    await prisma.bid.createMany({
      data: [...newBids],
    }),
      next()
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const recalculateNewWinningBid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const winningBid = await prisma.bid.findFirst({
      orderBy: {
        bidPrice: Prisma.Prisma.SortOrder.desc,
      },
      where: {
        bidder: {
          userBidStatus: {
            some: {
              auctionId: req.auction?.id || NaN,
              status: Prisma.BidStatus.ACCEPTED,
            },
          },
        },
      },
    })
    req.bid = winningBid
    next()
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}
