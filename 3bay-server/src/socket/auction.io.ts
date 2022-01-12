import { emitEvent } from './socket.io.js'
import { SocketEvent } from './socket-event.js'
import { getDetailsAuctionById } from '../controllers/auction.controller.js'
import c from 'ansi-colors'

export type AuctionFromGetDetails = Awaited<
  Promise<PromiseLike<ReturnType<typeof getDetailsAuctionById>>>
>

async function getAuctionAndEmit(
  auctionObj: number | undefined,
  emitCb: (auction: AuctionFromGetDetails) => void,
) {
  try {
    console.log(c.blue(`[Socket] Emitting auction details ${auctionObj}`))
    const auction = await getDetailsAuctionById(auctionObj)
    await emitCb(auction)
  } catch (e) {
    console.log(c.red(`[Socket] Cannot emit auction details ${auctionObj}`))
    console.log(e)
  }
}

export async function emitAuctionDetails(auctionId: number | undefined) {
  await getAuctionAndEmit(auctionId, (auction) => {
    emitEvent(SocketEvent.AUCTION_UPDATE, auction)
  })
}