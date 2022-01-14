import { emitEvent } from './socket.io.js'
import { SocketEvent } from './socket-event.js'
import { getDetailsAuctionById } from '../controllers/auction.controller.js'
import c from 'ansi-colors'
import Prisma from '@prisma/client'

export type AuctionFromGetDetails = Prisma.Prisma.PromiseReturnType<
  typeof getDetailsAuctionById
>

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

export async function emitAuctionDetails(auction: number | undefined | AuctionFromGetDetails) {
  await getAuctionAndEmit(auction, (auction) => {
    emitEvent(SocketEvent.AUCTION_UPDATE, auction)
  })
}
