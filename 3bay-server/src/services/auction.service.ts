import { Job, rescheduleJob, scheduleJob } from 'node-schedule'
import prisma from '../db/prisma.js'
import c from 'ansi-colors'

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
        },
      })

      for (const auction of auctions) {
        // console.log(auction.id)
        if (auction.closeTime) {
          const job = scheduleJob(
            new Date(auction.closeTime),
            this.onAuctionClosedCb(auction.id),
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
    const result = !!rescheduleJob(job, newDate)
    console.log(
      c.blue(
        `[AuctionScheduler] update ${auctionId} to ${newDate.toUTCString()}: ${result}`,
      ),
    )
    return result
  }

  add(auctionId: number, date: Date): boolean {
    if (this.jobs.has(auctionId)) {
      return this.update(auctionId, date)
    }

    const job = scheduleJob(date, this.onAuctionClosedCb(auctionId))
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

  onAuctionClosedCb(auctionId: number) {
    return () => {
      // send email
      console.log(c.blue(`[AuctionScheduler] Auction ${auctionId} closed`))
    }
  }
}

const scheduler = new AuctionScheduler()
export default scheduler
