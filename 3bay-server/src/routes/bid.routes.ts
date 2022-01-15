import { Router } from 'express'
import passport from 'passport'
import * as auctionController from '../controllers/auction.controller.js'
import * as bidController from '../controllers/bid.controller.js'
import * as authMdw from '../middlewares/auth.mdw.js'

const router = Router()

router
  .route('/setAccepted/:auctionId/:bidId')
  .patch(
    passport.authenticate('jwt', { session: false }),
    authMdw.requireSellerRole,
    auctionController.isAuctionClosed,
    bidController.isProductOwner,
    bidController.setBidStatusToAccepted,
    bidController.isWinningBid,             // might send header
    bidController.executeAutoBid,
    bidController.recalculateNewWinningBid,
    auctionController.update,
    bidController.notifyWhenBidAccepted,
  )

router
  .route('/setRejected/:auctionId/:bidId')
  .patch(
    passport.authenticate('jwt', { session: false }),
    authMdw.requireSellerRole,
    auctionController.isAuctionClosed,
    bidController.isProductOwner,
    bidController.setBidStatusToRejected,
    bidController.notifyWhenBidRejected, //
    bidController.isWinningBid,          // might send header
    bidController.executeAutoBid,
    bidController.recalculateNewWinningBid,
    auctionController.update,
    bidController.notifyWhenBidAccepted,
  )

router
  .route('/auto/:auctionId')
  .post(
    passport.authenticate('jwt', { session: false }),
    bidController.isSelfBid,
    bidController.checkUserBidStatus,
    bidController.isValidBidAmount,
    bidController.isValidScore,
    bidController.addAutoBid,
    bidController.add,
    bidController.executeAutoBid,
    bidController.recalculateNewWinningBid,
    auctionController.update,
  )

router
  .route('/:auctionId')
  .post(
    passport.authenticate('jwt', { session: false }),
    bidController.isSelfBid,
    bidController.isWinningBidder,
    bidController.checkUserBidStatus,
    bidController.isValidBidAmount,
    bidController.isValidScore,
    bidController.add,
    bidController.executeAutoBid,
    bidController.recalculateNewWinningBid,
    auctionController.update,
    bidController.notifyWhenNewBidPlaced,
  )
// check auctions is exist and opening
router.param('auctionId', auctionController.auctionById)
router.param('bidId', bidController.bidById)

export default router
