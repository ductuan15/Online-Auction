import { Router } from 'express'
import passport from 'passport'
import * as auctionController from '../controllers/auction.controller.js'
import * as bidController from '../controllers/bid.controller.js'
import * as authMdw from '../middlewares/auth.mdw.js'

const router = Router()

router.route('/setAccepted/:auctionId/:bidId').patch(
  passport.authenticate('jwt', { session: false }),
  authMdw.requireSellerRole,
  auctionController.isAuctionClosed,
  bidController.isProductOwner,
  bidController.setBidStatusToAccepted,
  bidController.isWinningBid, // might send header
  bidController.executeAutoBid,
  bidController.getWinningBid,
  auctionController.update,
  bidController.notifyWhenPriceChangedExcludingSeller,
)

router.route('/setRejected/:auctionId/:bidId').patch(
  passport.authenticate('jwt', { session: false }),
  authMdw.requireSellerRole,
  auctionController.isAuctionClosed,
  bidController.isProductOwner,
  bidController.setBidStatusToRejected,
  bidController.notifyWhenBidRejected, //
  bidController.isWinningBid, // might send header
  bidController.executeAutoBid,
  bidController.getWinningBid,
  auctionController.update,
  bidController.notifyWhenPriceChangedExcludingSeller,
)

router
  .route('/auto/:auctionId')
  .post(
    passport.authenticate('jwt', { session: false }),
    bidController.isSelfBid,
    bidController.isValidBidAmount,
    bidController.isValidScore,
    bidController.checkUserBidStatus,
    bidController.addAutoBid,
    bidController.getWinningBid,
    bidController.executeAutoBid,
    bidController.getWinningBid,
    auctionController.update,
    bidController.notifyWhenPriceChanged,
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    bidController.deleteAutoBid,
    auctionController.getUserBidStatus,
  )

router
  .route('/buyout/:auctionId')
  .post(
    passport.authenticate('jwt', { session: false }),
    bidController.isSelfBid,
    bidController.buyout,
    bidController.getWinningBid,
    auctionController.update,
    auctionController.closeAuction,
  )

router
  .route('/:auctionId')
  .post(
    passport.authenticate('jwt', { session: false }),
    bidController.isSelfBid,
    bidController.isWinningBidder,
    bidController.isValidBidAmount,
    bidController.isValidScore,
    bidController.checkUserBidStatus,
    bidController.add,
    bidController.executeAutoBid,
    bidController.getWinningBid,
    auctionController.update,
    bidController.notifyWhenPriceChanged,
  )

router
  .route('/:bidId')
  .delete(
    passport.authenticate('jwt', { session: false }),
    bidController.isBidOwner,
    bidController.resetWinningAuction,
    bidController.deleteBid,
    bidController.deleteAutoBid,
    bidController.getWinningBid,
    bidController.executeAutoBid,
    bidController.getWinningBidAndNotifyWhenPriceChanged,
    auctionController.update,
  )
// check auctions is exist and opening
router.param('auctionId', auctionController.auctionById)
router.param('bidId', bidController.bidById)

export default router
