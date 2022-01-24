import Prisma from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import {
  AuctionErrorCode,
  AuthErrorCode,
  BidErrorCode,
} from '../error/error-code.js'
import { AuctionError, AuthError, BidError } from '../error/error-exception.js'
import c from 'ansi-colors'
import { emitAuctionDetails } from '../socket/auction.io.js'
import { getProductByAuction } from './product.controller.js'
import { emitEventToUsers } from '../socket/socket.io.js'
import { NotifyData, SocketEvent } from '../socket/socket-event.js'
import sendMailTemplate from '../services/mail.service.js'
import MailType from '../const/mail.js'
import { AuctionRes } from '../types/AuctionRes.js'
import moment from 'moment'
import { Decimal } from '@prisma/client/runtime'
import _ from 'lodash'

// total reviews / total auctions
const VALID_SCORE = 0.8

const getMaximumBidPrice = (auction: Prisma.Auction) => {
  return auction.buyoutPrice || new Prisma.Prisma.Decimal(Infinity)
}

const getMinimumBidPrice = (auction: Prisma.Auction) => {
  let minimumPrice = !auction.winningBidId
    ? auction.openPrice
    : auction.currentPrice.add(auction.incrementPrice)
  if (minimumPrice.greaterThan(getMaximumBidPrice(auction))) {
    minimumPrice = getMaximumBidPrice(auction)
  }
  return minimumPrice
}

export const getWonAuction = async (userId: string) => {
  return await prisma.auction.findMany({
    include: {
      product: {
        select: {
          sellerId: true,
        },
      },
    },
    where: {
      OR: [
        {
          // user is the bidder of a product
          // and they have been reviewed by the seller
          winningBid: {
            bidderId: userId,
          },
          NOT: {
            sellerReview: null,
          },
        },
        // user is the seller of a product
        // and they have been reviewed by their bidder
        {
          product: {
            sellerId: userId,
          },
          NOT: {
            bidderReview: null,
          },
        },
      ],
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
    if (
      (auction.product.sellerId === userId && auction.bidderReview) ||
      auction.sellerReview
    ) {
      score += 1
    }
    wonAuction++
  })
  // console.log(c.green(`${score / wonAuction}`))
  return score / wonAuction
}

export const isValidScore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(c.yellow('bidController.isValidScore'))
  try {
    const score = await getScore(req.user?.uuid || '')
    if (score !== undefined && score < VALID_SCORE) {
      return next(new BidError({ code: BidErrorCode.InvalidScore }))
    } else {
      req.userStatusInAuction = Prisma.BidStatus.ACCEPTED
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
  console.log(c.yellow('bidController.isValidBidAmount'))
  try {
    // console.log(req.body.bidPrice)
    // minimumPrice<= bidPrice <= maximumPrice
    if (
      req.auction &&
      getMinimumBidPrice(req.auction).lessThanOrEqualTo(+req.body.bidPrice) &&
      getMaximumBidPrice(req.auction).greaterThanOrEqualTo(+req.body.bidPrice)
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

async function addABid(
  auction: AuctionRes | undefined | null,
  user: Partial<{ uuid: string }> | undefined | null,
  status: Prisma.BidStatus,
  bidPrice: Decimal | number | string,
) {
  return await prisma.$transaction([
    prisma.bid.create({
      data: {
        auctionId: auction?.id || NaN,
        bidderId: user?.uuid || '',
        bidPrice: bidPrice,
      },
      include: {
        bidder: {
          select: {
            email: true,
            name: true,
            uuid: true,
          },
        },
      },
    }),
    prisma.userBidStatus.upsert({
      where: {
        auctionId_userId: {
          auctionId: auction?.id || NaN,
          userId: user?.uuid || '',
        },
      },
      update: {
        status: status,
      },
      create: {
        auctionId: auction?.id || NaN,
        userId: user?.uuid || '',
        status: status,
      },
    }),
  ])
}

export const add = async (req: Request, res: Response, next: NextFunction) => {
  console.log(c.yellow('bidController.add'))
  try {
    const status = req.userStatusInAuction || Prisma.BidStatus.PENDING
    const autoBids = await getAutoBids(req.auction)
    const winnerOfAutoBid = _.maxBy(autoBids, (bid) => {
      return maximumPossibleBidPrice(bid, req.auction)
    })

    const maxPossibleBidPrice = maximumPossibleBidPrice(
      winnerOfAutoBid!,
      req.auction,
    )
    // let bid: Prisma.Prisma.PromiseReturnType<
    //   typeof addABid
    //   >[0]
    let user = { uuid: req.user?.uuid }

    // When there is an auto-bid that its max price equals to the bid price of
    // the pending bid.
    // Then new bid should belongs to the owner of auto-bid, since they chose
    // that price first.
    if (
      maxPossibleBidPrice.equals(new Prisma.Prisma.Decimal(req.body.bidPrice))
    ) {
      user = {
        uuid: winnerOfAutoBid?.userId,
      }
    }
    const [bid] = await addABid(req.auction, user, status, req.body.bidPrice)

    if (status === Prisma.BidStatus.ACCEPTED) {
      req.bid = bid
      next()
    } else {
      res.json(req.auction)
      if (req.auction?.id) {
        await emitAuctionDetails(req.auction.id)
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}
export const isBidOwner = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.bid?.bidderId !== req.user?.uuid) {
    throw new BidError({ code: BidErrorCode.NotBidOwner })
  }
  next()
}

export const deleteAutoBid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.auction) {
    return next(new AuctionError({ code: AuctionErrorCode.AuctionNotFound }))
  }
  if (!req.user) {
    return next(new AuthError({ code: AuthErrorCode.InvalidRequest }))
  }
  try {
    const autoBid = await prisma.autoBid.findUnique({
      where: {
        auctionId_userId: {
          auctionId: req.auction?.id,
          userId: req.user?.uuid || '',
        },
      },
    })

    if (autoBid) {
      await prisma.autoBid.delete({
        where: {
          auctionId_userId: {
            auctionId: req.auction?.id,
            userId: req.user?.uuid || '',
          },
        },
      })
    }
    return next()
  } catch (err) {
    next(err)
  }
}

export const deleteBid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await prisma.bid.delete({
      where: {
        id: req.bid?.id,
      },
    })
    next()
  } catch (err) {
    next(err)
  }
}

export const resetWinningAuction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auction = await prisma.auction.findUnique({
      where: { id: req.bid?.auctionId },
    })

    req.auction = await prisma.auction.update({
      where: {
        id: req.bid?.auctionId,
      },
      data: {
        winningBid: {
          disconnect: true,
        },
        currentPrice: auction?.openPrice || 0,
      },
    })
    next()
  } catch (err) {
    next(err)
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
  console.log(c.yellow('bidController.isProductOwner'))
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
  console.log(c.yellow('bidController.setBidStatusToRejected'))
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

export async function getBidById(
  bidId: number | undefined,
  auctionId: number | undefined,
) {
  return await prisma.bid.findFirst({
    include: {
      bidder: {
        select: {
          uuid: true,
          name: true,
          email: true,
        },
      },
    },
    where: {
      id: +(bidId || NaN),
      auctionId: auctionId,
    },
    rejectOnNotFound: true,
  })
}

export const bidById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.bid = await getBidById(+(req.params.bidId || NaN), req.auction?.id)
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
  console.log(c.yellow('bidController.isWinningBid'))
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
      if (req.auction?.id) {
        await emitAuctionDetails(req.auction.id)
      }
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
  console.log(c.yellow('bidController.checkUserBidStatus'))
  try {
    const userBidStatus = await prisma.userBidStatus.findUnique({
      where: {
        auctionId_userId: {
          auctionId: req.auction?.id || NaN,
          userId: req.user?.uuid || '',
        },
      },
    })
    if (userBidStatus) {
      if (userBidStatus.status === Prisma.BidStatus.PENDING) {
        return next(new BidError({ code: BidErrorCode.HavingPendingBid }))
      } else if (userBidStatus.status === Prisma.BidStatus.REJECTED) {
        return next(new BidError({ code: BidErrorCode.InBlacklist }))
      } else {
        req.userStatusInAuction = userBidStatus.status
      }
    }
    next()
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
  console.log(c.yellow('bidController.isSelfBid'))
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
  console.log(c.yellow('bidController.isWinningBidder'))
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
  if (!req.user) {
    return next(new AuthError({ code: AuthErrorCode.InvalidRequest }))
  }
  if (!req.userStatusInAuction) {
    return next(new BidError({ code: BidErrorCode.NotAcceptedYet }))
  }
  try {
    if (req.auction) {
      await prisma.autoBid.upsert({
        update: {
          maximumPrice: req.body.bidPrice,
        },
        create: {
          maximumPrice: req.body.bidPrice,
          auctionId: req.auction?.id,
          userId: req.user.uuid,
        },
        where: {
          auctionId_userId: {
            auctionId: req.auction.id,
            userId: req.user.uuid,
          },
        },
      })
      if (req.userStatusInAuction === Prisma.BidStatus.ACCEPTED) {
        let bidPrice = !req.auction?.winningBidId
          ? req.auction.openPrice
          : req.auction?.currentPrice.add(req.auction?.incrementPrice)

        await addABid(req.auction, req.user, req.userStatusInAuction, bidPrice)
      }
    }
    next()
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

function maximumPossibleBidPrice(
  autoBid: Prisma.autoBid,
  auction: Prisma.Auction | null | undefined,
) {
  // maximumPrice - (maximumPrice - openPrice) mod incrementPrice
  return auction
    ? autoBid.maximumPrice.minus(
        autoBid.maximumPrice
          .minus(auction.openPrice)
          .mod(auction.incrementPrice),
      )
    : autoBid.maximumPrice
}

async function getAutoBids(auction: Prisma.Auction | null | undefined) {
  return await prisma.autoBid.findMany({
    where: {
      auctionId: auction?.id || NaN,
      user: {
        userBidStatus: {
          none: {
            OR: [
              {
                auctionId: auction?.id || NaN,
                status: Prisma.BidStatus.REJECTED,
              },
              {
                auctionId: auction?.id || NaN,
                status: Prisma.BidStatus.PENDING,
              },
            ],
          },
        },
      },
    },
    // include: {
    //   auctions: true,
    // },
    orderBy: {
      createdTime: Prisma.Prisma.SortOrder.asc,
    },
  })
}

function whoShouldWin(autoBids: Prisma.autoBid[], auction: Prisma.Auction) {
  const winner = _.maxBy(autoBids, (bid) => {
    return maximumPossibleBidPrice(bid, auction)
  })

  // console.log(c.magenta(`[Auction] Winner ${winner!.userId}`))

  const maxPossibleBidPrice = maximumPossibleBidPrice(winner!, auction)

  let nSameMaxPossibleBidPrice = 0
  autoBids.forEach((bid) => {
    // console.log(`maximumPossibleBidPrice(bid, auction) = ${maximumPossibleBidPrice(bid, auction).toNumber()}`)
    if (
      maximumPossibleBidPrice(bid, auction).equals(
        maximumPossibleBidPrice(bid, auction),
      )
    ) {
      ++nSameMaxPossibleBidPrice
    }
  })

  const maxStepPossible = maxPossibleBidPrice
    .minus(auction.currentPrice)
    .divToInt(auction.incrementPrice)
    .toNumber()

  const totalStepPossible = maxStepPossible - (maxStepPossible % 2)
  return {
    winner,
    maxPossibleBidPrice,
    nSameMaxPossibleBidPrice,
    totalStepPossible,
  }
}

function newSingleAutoBid(
  autoBid: any,
  curWinningPrice: Prisma.Prisma.Decimal,
  auction: Prisma.Auction,
) {
  return {
    auctionId: autoBid.auctionId,
    bidPrice: curWinningPrice
      .add(auction.incrementPrice)
      .clamp(getMinimumBidPrice(auction), getMaximumBidPrice(auction)),
    bidderId: autoBid.userId,
    bidTime: new Date(),
  }
}

export const executeAutoBid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(c.yellow('bidController.executeAutoBid'))
  if (!req.auction) {
    return next(new AuctionError({ code: AuctionErrorCode.AuctionNotFound }))
  }
  try {
    const autoBids = await getAutoBids(req.auction)

    // add auto bid to bid table
    if (req.bid) {
      const newBids: Prisma.Prisma.BidCreateManyInput[] = []
      let curWinningBidder = req.bid.bidderId
      let curWinningPrice = req.bid.bidPrice

      const {
        // winner,
        maxPossibleBidPrice,
        nSameMaxPossibleBidPrice,
        totalStepPossible,
      } = whoShouldWin(autoBids, req.auction)
      let nStep = 0
      let forceBreak = false

      while (true) {
        let wasFoundNewWinner = false

        for (const autoBid of autoBids) {
          if (nSameMaxPossibleBidPrice > 1 && nStep === totalStepPossible - 1) {
            // Case: 2 bidders (person A, person B) who triggered the auto bid execution,
            // those auto bids have the same maximum price.
            // Person B bid after person A.
            //
            // If the autoBid operation continued, the winner would be the person
            // B who bid after person A.
            // But the winner should be person A.
            // So we should stop the iteration
            // & set the bid price of the latest bid the maximum price
            // (newBids[totalStepPossible - 2] is person A btw).
            newBids[totalStepPossible - 2].bidPrice = maxPossibleBidPrice
            wasFoundNewWinner = true
            forceBreak = true
            break
          }

          const possibleMaximumBidPrice = maximumPossibleBidPrice(
            autoBid,
            req.auction,
          )

          if (
            req.auction &&
            possibleMaximumBidPrice.greaterThan(curWinningPrice) &&
            autoBid.userId !== curWinningBidder
          ) {
            //create new bid
            const newBid = newSingleAutoBid(
              autoBid,
              curWinningPrice,
              req.auction,
            )
            newBids.push(newBid)

            curWinningBidder = newBid.bidderId
            curWinningPrice = newBid.bidPrice
            wasFoundNewWinner = true
            ++nStep
          }
        }

        if (!wasFoundNewWinner || forceBreak) {
          break
        }
      }
      await prisma.bid.createMany({
        data: [...newBids],
      })
    } else {
    }
    next()
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export async function getWinningBidFromAuction(
  auction: AuctionRes | null | undefined,
) {
  return await prisma.bid.findFirst({
    orderBy: {
      bidPrice: Prisma.Prisma.SortOrder.desc,
    },
    where: {
      bidder: {
        userBidStatus: {
          none: {
            OR: [
              {
                auctionId: auction?.id || NaN,
                status: Prisma.BidStatus.REJECTED,
              },
              {
                auctionId: auction?.id || NaN,
                status: Prisma.BidStatus.PENDING,
              },
            ],
          },
        },
      },
      auctionId: auction?.id || NaN,
    },
    include: {
      bidder: {
        select: {
          email: true,
          name: true,
          uuid: true,
        },
      },
    },
  })
}

export const getWinningBid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(c.yellow('bidController.getWinningBid'))
  try {
    req.bid = await getWinningBidFromAuction(req.auction)
    next()
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export async function buyout(req: Request, res: Response, next: NextFunction) {
  if (!req.auction || !req.auction.buyoutPrice) {
    return next(new AuctionError({ code: AuctionErrorCode.BuyoutNotAvailable }))
  }
  if (req.auction && moment(req.auction.closeTime).isBefore()) {
    return next(new AuctionError({ code: AuctionErrorCode.ClosedAuction }))
  }

  try {
    const [bid] = await addABid(
      req.auction,
      req.user,
      Prisma.BidStatus.ACCEPTED,
      req.auction.buyoutPrice,
    )
    req.bid = bid
    next()
  } catch (e) {
    next(e)
  }
}

export async function getWinningBidAndNotifyWhenPriceChanged(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(c.yellow('bidController.getWinningBidAndNotfiyWhenBidChanged'))
  try {
    req.bid = await getWinningBidFromAuction(req.auction)
    if (
      req.auction &&
      (req.bid?.id !== req.auction.winningBidId ||
        (req.bid === null && req.auction.winningBidId !== null))
    ) {
      return notifyWhenPriceChanged(req, res, next)
    }
    return next()
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

async function getInvolvedBidders(auctionId: number | undefined) {
  return await prisma.user.findMany({
    select: {
      uuid: true,
      name: true,
      email: true,
    },
    distinct: 'uuid',
    where: {
      bids: {
        some: {
          auctionId: auctionId,
        },
      },
      NOT: {
        userBidStatus: {
          some: {
            OR: [
              {
                auctionId: auctionId,
                status: Prisma.BidStatus.REJECTED,
              },
              {
                auctionId: auctionId,
                status: Prisma.BidStatus.PENDING,
              },
            ],
          },
        },
      },
    },
  })
}

export const notifyWhenPriceChanged = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(c.yellow('bidController.notifyWhenNewBidPlaced'))
  if (!req.user) {
    return next(new AuthError({ code: AuthErrorCode.InvalidRequest }))
  }
  try {
    const product = await getProductByAuction(req.auction)
    const involvedBidders = await getInvolvedBidders(req.auction?.id)
    const seller = await prisma.user.findUnique({
      select: {
        email: true,
        name: true,
      },
      where: {
        uuid: product.sellerId,
      },
      rejectOnNotFound: true,
    })

    const notifyData: NotifyData = {
      type: 'AUCTION_NEW_BID',
      data: product,
      date: new Date(),
    }

    emitEventToUsers(
      [
        ...involvedBidders.map((user) => {
          return user.uuid
        }),
        product.sellerId,
      ],
      SocketEvent.AUCTION_NOTIFY,
      notifyData,
    )

    await prisma.notifications.createMany({
      data: [
        ...involvedBidders.map((user) => {
          return {
            uuid: user.uuid,
            type: notifyData.type,
            productId: product.id,
            date: notifyData.date,
          }
        }),
        {
          uuid: product.sellerId,
          type: notifyData.type,
          productId: product.id,
          date: notifyData.date,
        },
      ],
    })

    for (const { email, name, uuid } of involvedBidders) {
      // no need to send notification to the user
      // who placed this bid
      if (req.user.uuid === uuid) {
        continue
      }
      await sendMailTemplate(
        [email],
        MailType.AUCTION_NEW_BID_TO_BIDDER,
        {
          productName: product.name,
          name: name,
        },
        [product.name],
      )
    }

    await sendMailTemplate(
      [seller.email],
      MailType.AUCTION_CLOSED_TO_SELLER,
      {
        productName: product.name,
        name: seller.name,
      },
      [product.name],
    )

    next()
  } catch (e) {
    next(e)
  }
}

export const notifyWhenPriceChangedExcludingSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(c.yellow('bidController.notifyWhenPriceChangedExcludingSeller'))
  try {
    const product = await getProductByAuction(req.auction)

    const involvedBidders = await getInvolvedBidders(req.auction?.id)

    const notifyData: NotifyData = {
      type: 'AUCTION_NEW_BID',
      data: product,
      date: new Date(),
    }

    emitEventToUsers(
      [
        ...involvedBidders.map((user) => {
          return user.uuid
        }),
      ],
      SocketEvent.AUCTION_NOTIFY,
      notifyData,
    )

    await prisma.notifications.createMany({
      data: [
        ...involvedBidders.map((user) => {
          return {
            uuid: user.uuid,
            type: notifyData.type,
            productId: product.id,
            date: notifyData.date,
          }
        }),
      ],
    })

    for (const { email, name } of involvedBidders) {
      await sendMailTemplate(
        [email],
        MailType.AUCTION_NEW_BID_TO_BIDDER,
        {
          productName: product.name,
          name: name,
        },
        [product.name],
      )
    }

    next()
  } catch (e) {
    next(e)
  }
}

export const notifyWhenBidRejected = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(c.yellow('bidController.notifyWhenBidRejected'))
  try {
    if (!req.bid) {
      return next(new BidError({ code: BidErrorCode.BidderNotFound }))
    }

    const product = await getProductByAuction(req.auction)

    const notifyData: NotifyData = {
      type: 'AUCTION_BID_REJECTED',
      data: product,
      date: new Date(),
    }

    emitEventToUsers(
      [req.bid.bidder.uuid],
      SocketEvent.AUCTION_NOTIFY,
      notifyData,
    )
    await prisma.notifications.create({
      data: {
        uuid: req.bid.bidder.uuid,
        type: notifyData.type,
        productId: product.id,
        date: notifyData.date,
      },
    })

    await sendMailTemplate(
      [req.bid.bidder.email],
      MailType.AUCTION_BID_REJECTED,
      {
        productName: product.name,
        name: req.bid.bidder.name,
      },
      [], // TODO: add titleData if necessary
    )
    console.log(c.green(`Send email to ${req.bid.bidder.email}`))
    next()
  } catch (e) {
    next(e)
  }
}
