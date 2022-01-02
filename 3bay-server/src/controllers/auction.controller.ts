import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import { BidErrorCode } from '../error/error-code.js'
import { BidError } from '../error/error-exception.js'
import { AuctionRes } from '../types/AuctionRes.js'

const userShortenSelection = {
  uuid: true,
  name: true,
  address: true,
  email: true,
}

export const auctionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auctionId = +(req.params.auctionId || NaN)
    req.auction = await prisma.auction.findUnique({
      where: {
        id: auctionId,
      },
      include: {
        winningBid: {
          include: {
            bidder: {
              select: userShortenSelection,
            },
          },
        },
      },
      rejectOnNotFound: true,
    })
    next()
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(req.auction)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auction: AuctionRes = await prisma.auction.create({
      data: {
        incrementPrice: req.body.incrementPrice,
        autoExtendAuctionTiming: req.body.autoExtendAuctionTiming,
        openPrice: +req.body.openPrice,
        productId: +(req.product?.id || NaN),
        closeTime: new Date(req.body.closeTime),
        buyoutPrice: req.body.buyoutPrice,
      },
    })
    res.json(auction)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const getLatestAuction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auction = await prisma.auction.findFirst({
      where: {
        productId: +(req.product?.id || '/'),
      },
      include: {
        winningBid: {
          include: {
            bidder: {
              select: userShortenSelection,
            },
          },
        },
        bids: true,
      },
    })
    res.json(auction)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const auctionsByProductId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auctions = await prisma.auction.findMany({
      where: {
        productId: req.product?.id,
      },
      include: {
        winningBid: {
          include: {
            bidder: {
              select: userShortenSelection,
            },
          },
        },
      },
    })
    res.json(auctions)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auction = await prisma.auction.update({
      where: {
        id: req.auction?.id,
      },
      data: {
        winningBidId: req.bid?.id || null,
        currentPrice: req.bid?.bidPrice || 0,
      },
    })
    res.json(auction)
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const checkAuctionExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.auction = await prisma.auction.findFirst({
      where: {
        id: +req.params.auctionId,
        closeTime: {
          gt: new Date(),
        },
      },
    })
    next()
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}
