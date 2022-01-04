import { emitEvent } from './socket.io.js'
import { SocketEvent } from './socket-event.js'
import { getDetailsAuctionById } from '../controllers/auction.controller.js'
import c from 'ansi-colors'

export async function emitAuctionDetails(auctionId: number | undefined) {
  try {
    console.log(c.blue(`Emitting auction details ${auctionId}`))
    const auction = await getDetailsAuctionById(auctionId)
    emitEvent(SocketEvent.UPDATE_AUCTION, auction)
  } catch (e) {
    console.log(c.red(`Cannot emit auction details ${auctionId}`))
    console.log(e)
  }
}