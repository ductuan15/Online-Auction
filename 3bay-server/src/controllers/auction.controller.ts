import Prisma from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import { AuctionRes } from '../types/AuctionRes.js'

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
    res.json(req.product)
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
            bidder: true,
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
            bidder: true,
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
