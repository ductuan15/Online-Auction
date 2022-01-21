import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import Prisma from '@prisma/client'
import c from 'ansi-colors'
import { getProductByAuction } from '../controllers/product.controller.js'
import { NotifyData, SocketEvent } from '../socket/socket-event.js'
import { emitEventToUsers } from '../socket/socket.io.js'
import sendMailTemplate from '../services/mail.service.js'
import MailType from '../const/mail.js'
import { emitAuctionDetails } from '../socket/auction.io.js'

export function processBidRequest(isAccepted: boolean) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.userBidStatus.update({
        where: {
          auctionId_userId: {
            auctionId: req.auction?.id || NaN,
            userId: req.params?.userId || '',
          },
        },
        data: {
          status: isAccepted
            ? Prisma.BidStatus.ACCEPTED
            : Prisma.BidStatus.REJECTED,
        },
      })
      next()
    } catch (err) {
      next(err)
    }
  }
}

export function notifyWhenBidRequestProceed(isAccepted: boolean) {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(c.yellow('auctionMdw.notifyWhenBidRequestProceed'))

    try {
      const product = await getProductByAuction(req.auction)
      const user = await prisma.user.findUnique({
        where: {
          uuid: req.params.userId,
        },
        rejectOnNotFound: true,
      })

      const notifyData: NotifyData = {
        type: isAccepted ? 'BID_REQUEST_ACCEPTED' : 'BID_REQUEST_REJECTED',
        data: product,
        date: new Date(),
      }

      await emitAuctionDetails(req.auction?.id)
      emitEventToUsers([user?.uuid], SocketEvent.AUCTION_NOTIFY, notifyData)

      await prisma.notifications.create({
        data: {
          uuid: user.uuid,
          type: notifyData.type,
          productId: product.id,
          date: notifyData.date,
        },
      })

      await sendMailTemplate(
        [user.email],
        isAccepted
          ? MailType.AUCTION_BID_REQUEST_ACCEPTED
          : MailType.AUCTION_BID_REQUEST_REJECTED,
        {
          productName: product.name,
          name: user.name,
        },
        [product.name],
      )

      next()
    } catch (err) {
      next(err)
    }
  }
}
