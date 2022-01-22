import { emitEventToSocketClients } from './socket.io.js'
import { SocketEvent } from './socket-event.js'
import { getDetailsAuctionById } from '../controllers/auction.controller.js'
import c from 'ansi-colors'
import Prisma from '@prisma/client'

export type AuctionFromGetDetails = Prisma.Prisma.PromiseReturnType<
  typeof getDetailsAuctionById
>

class AuctionMap {
  private map = new Map<number, Set<string>>()
  private reverseMap = new Map<string, number>()
  private readonly verbose: boolean

  constructor(verbose = false) {
    this.verbose = verbose
  }

  add(auctionId: number, socketId: string) {
    if (this.map.has(auctionId)) {
      this.map.get(auctionId)?.add(socketId)
    } else {
      this.map.set(auctionId, new Set([socketId]))
    }
    this.reverseMap.set(socketId, auctionId)
    if (this.verbose) {
      console.log(this.map)
      console.log(this.reverseMap)
    }
  }

  removeAuction(auctionId: number) {
    const auctions = this.map.get(auctionId)
    this.map.delete(auctionId)
    auctions?.forEach((id) => this.reverseMap.delete(id))
  }

  removeSocketId(socketId: string) {
    const auctionId = this.reverseMap.get(socketId)
    this.reverseMap.delete(socketId)
    if (auctionId) {
      this.map.get(auctionId)?.delete(socketId)
      if (this.map.get(auctionId)?.size === 0) {
        this.map.delete(auctionId)
      }
    }
    if (this.verbose) {
      console.log(this.map)
      console.log(this.reverseMap)
    }
  }

  getSocketClients(auctionId: number): Set<string> | undefined {
    return this.map.get(auctionId)
  }
}

async function getAuctionAndEmit(
  auctionObj: number | undefined | AuctionFromGetDetails,
  emitCb: (auction: AuctionFromGetDetails) => void,
) {
  try {
    console.log(c.blue(`[Socket] Emitting auction details ${auctionObj}`))

    let auction: AuctionFromGetDetails
    if (typeof auctionObj === 'number' || typeof auctionObj === 'undefined') {
      auction = await getDetailsAuctionById(auctionObj)
    } else {
      auction = auctionObj
    }

    await emitCb(auction)
  } catch (e) {
    console.log(c.red(`[Socket] Cannot emit auction details ${auctionObj}`))
    console.log(e)
  }
}

export async function emitAuctionDetails(
  auction: number | undefined | AuctionFromGetDetails,
) {
  await getAuctionAndEmit(auction, (auction) => {
    emitEventToSocketClients(
      auctionSocketMap.getSocketClients(auction.id),
      SocketEvent.AUCTION_UPDATE,
      auction,
    )
  })
}

export const auctionSocketMap = new AuctionMap(true)
