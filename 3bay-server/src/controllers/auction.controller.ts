import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import { AuctionRes } from '../types/AuctionRes.js'

export const auctionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auctionId = +(req.query.auctionId || '/')
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
        productId: +req.body.productId,
        closeTime: req.body.closeTime
      },
    })
    res.json(auction)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const getOpenAuction = async (productId: number) => {
  return prisma.auction.findFirst({
    where: {
      productId: productId,
      closeTime: null,
    },
  })
}
