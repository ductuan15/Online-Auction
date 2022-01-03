import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import { AuctionRes } from '../types/AuctionRes.js'
import Prisma from '@prisma/client'
import { AuctionErrorCode } from '../error/error-code.js'
import { AuctionError } from '../error/error-exception.js'
import { includeProductDetailInfo } from './product.controller.js'
import {getAllThumbnailLink} from "./images-product.controller.js";
import {ProductRes} from "../types/ProductRes";
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
        UserBidStatus: true,
        bids: {
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
        UserBidStatus: true,
        bids: {
          include: {
            bidder: {
              select: userShortenSelection,
            },
          },
        },
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
      rejectOnNotFound: true,
    })
    next()
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

enum USER_BID_STATUS {
  NOBID,
  PENDING,
  REJECTED,
  ACCEPTED_NOT_WINNING,
  WINNING,
}

export const getUserBidStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userBidStatus = await prisma.userBidStatus.findUnique({
      where: {
        auctionId_userId: {
          auctionId: req.auction?.id || NaN,
          userId: req.user.uuid,
        },
      },
    })
    const response: {
      auctionId: number
      status?: number
    } = {
      auctionId: req.auction?.id || NaN,
    }
    switch (userBidStatus?.status) {
      case null || undefined:
        response.status = USER_BID_STATUS.NOBID
        break
      case Prisma.BidStatus.PENDING:
        response.status = USER_BID_STATUS.PENDING
        break
      case Prisma.BidStatus.REJECTED:
        response.status = USER_BID_STATUS.REJECTED
        break
      case Prisma.BidStatus.ACCEPTED:
        const winningBid = await prisma.bid.findUnique({
          where: {
            id: req.auction?.winningBidId || NaN,
          },
        })
        if (winningBid?.bidderId !== req.user.uuid) {
          response.status = USER_BID_STATUS.ACCEPTED_NOT_WINNING
        } else {
          response.status = USER_BID_STATUS.WINNING
        }
        break
      default:
        break
    }
    res.json(response)
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const updataSellerReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.auction?.closeTime && req.auction.closeTime > new Date()) {
      throw new AuctionError({ code: AuctionErrorCode.NotClosedAuction })
    } else {
      req.auction = await prisma.auction.update({
        where: {
          id: req.auction?.id,
        },
        data: {
          sellerComment: req.body.sellerComment,
          sellerReview: !!req.body.sellerReview,
        },
      })
    }
    res.json(req.auction)
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const updataBidderReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.auction?.closeTime && req.auction.closeTime > new Date()) {
      throw new AuctionError({ code: AuctionErrorCode.NotClosedAuction })
    } else {
      req.auction = await prisma.auction.update({
        where: {
          id: req.auction?.id,
        },
        data: {
          bidderComment: req.body.bidderComment,
          bidderReview: !!req.body.bidderReview,
        },
      })
    }
    res.json(req.auction)
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const isAuctionWinner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let winningBid: Prisma.Bid | null = null
    if (req.auction) {
      winningBid = await prisma.bid.findUnique({
        where: {
          id: req.auction?.winningBidId || 0,
        },
      })
    }
    if (winningBid?.bidderId !== req.user.uuid) {
      throw new AuctionError({ code: AuctionErrorCode.NotWinner })
    } else {
      next()
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
    const product = await prisma.product.findUnique({
      where: {
        id: req.auction?.productId,
      },
    })
    if (product?.sellerId !== req.user.uuid) {
      throw new AuctionError({ code: AuctionErrorCode.NotProductOwner })
    } else {
      next()
    }
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const getJoinedAuction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const joinedAuctions: ProductRes[] = await prisma.product.findMany({
      where: {
        latestAuction: {
          bids: {
            some: {
              bidderId: req.user.uuid,
            },
          },
          closeTime: {
            gt: new Date(),
          },
        },
      },
      include: includeProductDetailInfo,
    })
    joinedAuctions.forEach((product) => {
      product.thumbnails = getAllThumbnailLink(product.id)
    })
    res.json(joinedAuctions)
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const getWonAuction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const joinedAuctions = await prisma.product.findMany({
      where: {
        latestAuction: {
          winningBid: {
            bidderId: req.user?.uuid || '',
          },
          closeTime: {
            lt: new Date(),
          },
        },
      },
      include: includeProductDetailInfo,
    })
    res.json(joinedAuctions)
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const closeAuction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (
      req.auction &&
      req.auction.closeTime &&
      req.auction?.closeTime > new Date()
    ) {
      const auction = await prisma.auction.update({
        where: {
          id: req.auction?.id,
        },
        data: {
          closeTime: new Date(),
        },
      })
      res.json(auction)
    } else {
      throw new AuctionError({ code: AuctionErrorCode.ClosedAuction })
    }
  } catch (err) {
    if(err instanceof Error){
      next(err)
    }
  }
}
