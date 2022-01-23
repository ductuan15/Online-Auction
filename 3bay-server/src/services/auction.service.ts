import { Job, rescheduleJob, scheduleJob } from 'node-schedule'
import prisma from '../db/prisma.js'
import c from 'ansi-colors'
import { getDetailsAuctionById } from '../controllers/auction.controller.js'
import Prisma from '@prisma/client'
import { emitEventToUsers } from '../socket/socket.io.js'
import { NotifyData, SocketEvent } from '../socket/socket-event.js'
import sendMailTemplate from './mail.service.js'
import MailType from '../const/mail.js'
import { emitAuctionDetails } from '../socket/auction.io.js'
import { ProductRes } from '../types/ProductRes.js'
import { getProductByAuction } from '../controllers/product.controller.js'
import moment from 'moment/moment.js'

type AuctionResponse = Prisma.Prisma.PromiseReturnType<
  typeof getDetailsAuctionById
>

class AuctionScheduler {
  // key: auction id
  private jobs: Map<number, Job>

  constructor() {
    this.jobs = new Map<number, Job>()
  }

  async init() {
    try {
      const auctions = await prisma.auction.findMany({
        where: {
          closeTime: {
            gt: new Date(),
          },
          product: {
            deletedAt: null,
          },
        },
      })

      for (const auction of auctions) {
        // console.log(auction.id)
        if (auction.closeTime) {
          const job = scheduleJob(
            new Date(auction.closeTime),
            onAuctionClosedCallback(auction.id),
          )
          this.jobs.set(auction.id, job)
        }
      }

      console.log(
        c.blue(`[AuctionScheduler] Scheduled ${this.jobs.size} auction(s)`),
      )
    } catch (e) {
      console.error(c.red(`[AuctionScheduler] Could not init AuctionScheduler`))
      console.error(e)
    }
  }

  update(auctionId: number, newDate: Date): boolean {
    const job = this.jobs.get(auctionId)
    if (!job) {
      return false
    }
    if (moment(newDate).isBefore()) {
      this.remove(auctionId)
      return true
    }
    const result = !!rescheduleJob(job, newDate)
    console.log(
      c.blue(
        `[AuctionScheduler] update ${auctionId} to ${newDate.toUTCString()}: ${result}`,
      ),
    )
    return result
  }

  add(auctionId: number, date: Date): boolean {
    if (moment(date).isBefore()) {
      return false
    }

    if (this.jobs.has(auctionId)) {
      return this.update(auctionId, date)
    }

    const job = scheduleJob(date, onAuctionClosedCallback(auctionId))
    this.jobs.set(auctionId, job)
    console.log(
      c.blue(`[AuctionScheduler] add ${auctionId} - ${date.toUTCString()}`),
    )
    return true
  }

  remove(auctionId: number): boolean {
    const result = this.jobs.delete(auctionId)
    console.log(c.blue(`[AuctionScheduler] remove ${auctionId}: ${result}`))
    return result
  }
}

export function onAuctionClosedCallback(auctionId: number) {
  return async () => {
    console.log(c.blue(`[AuctionScheduler] Auction ${auctionId} closed`))
    try {
      const auction = await getDetailsAuctionById(auctionId)
      const seller = await prisma.user.findUnique({
        select: {
          email: true,
          name: true,
        },
        where: {
          uuid: auction.product.sellerId,
        },
        rejectOnNotFound: true,
      })

      const product = await getProductByAuction(auction)

      await emitAuctionDetails(auction)

      if (auction.winningBid) {
        console.log(c.blue(`[AuctionScheduler] onAuctionClosedAndHadWinner`))
        await onAuctionClosedAndHadWinner(auction, product, seller)
      } else {
        console.log(c.blue(`[AuctionScheduler] onAuctionClosedNoWinner`))
        await onAuctionClosedNoWinner(auction, product, seller)
      }
    } catch (e) {
      console.error(c.red(`[AuctionScheduler] Error occurred`))
      console.error(e)
    }
  }
}

async function onAuctionClosedNoWinner(
  auction: AuctionResponse,
  product: ProductRes,
  seller: { email: string; name: string },
) {
  const notifyData: NotifyData = {
    type: 'AUCTION_CLOSED_NO_WINNER',
    data: product,
    date: new Date(),
  }

  emitEventToUsers(
    [auction.product.sellerId],
    SocketEvent.AUCTION_NOTIFY,
    notifyData,
  )

  await prisma.notifications.create({
    data: {
      uuid: auction.product.sellerId,
      type: notifyData.type,
      productId: product.id,
      date: notifyData.date,
    },
  })

  await sendMailTemplate(
    [seller.email],
    MailType.AUCTION_CLOSED_NO_WINNER,
    {
      name: seller.name,
      productName: product.name,
    },
    [product.name],
  )
}

async function onAuctionClosedAndHadWinner(
  auction: AuctionResponse,
  product: Prisma.Product,
  seller: { email: string; name: string },
) {
  if (!auction.winningBid) return

  const winner = await prisma.user.findUnique({
    select: {
      email: true,
      name: true,
    },
    where: {
      uuid: auction.winningBid?.bidder.uuid,
    },
    rejectOnNotFound: true,
  })

  const notifyData: NotifyData = {
    type: 'AUCTION_CLOSED_HAD_WINNER',
    data: product,
    date: new Date(),
  }

  emitEventToUsers(
    [auction.product.sellerId, auction.winningBid.bidder.uuid],
    SocketEvent.AUCTION_NOTIFY,
    notifyData,
  )

  await prisma.notifications.createMany({
    data: [
      ...[auction.product.sellerId, auction.winningBid.bidder.uuid].map(
        (uuid) => {
          return {
            uuid,
            type: notifyData.type,
            productId: product.id,
            date: notifyData.date,
          }
        },
      ),
    ],
  })

  for (const user of [
    { ...seller, type: MailType.AUCTION_CLOSED_TO_SELLER },
    { ...winner, type: MailType.AUCTION_CLOSED_TO_BIDDER },
  ]) {
    console.log(c.blue(`[AuctionScheduler] Send email to ${user.email}`))

    await sendMailTemplate(
      [user.email],
      user.type,
      {
        name: user.name,
        productName: product.name,
      },
      [product.name],
    )
  }
}

const scheduler = new AuctionScheduler()
export default scheduler
