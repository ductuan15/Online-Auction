import { Router } from 'express'
import passport from 'passport'
import * as auctionController from '../controllers/auction.controller.js'
import * as bidController from '../controllers/bid.controller.js'
import * as authMdw from '../middlewares/auth.mdw.js'

const route = Router()

route.route('/:auctionId').post(
  // TODO: Winning bid bid again .-.
  passport.authenticate('jwt', { session: false }),
  bidController.isSelfBid,
  bidController.isWinningBidder,
  bidController.checkUserBidStatus,
  bidController.isValidBidAmount,
  bidController.isValidScore,
  bidController.add,
  auctionController.update,
)

route
  .route('/setAccepted/:auctionId/:bidId')
  .patch(
    passport.authenticate('jwt', { session: false }),
    authMdw.requireSellerRole,
    bidController.isProductOwner,
    bidController.setBidStatusToAccepted,
    bidController.isWinningBid,
    auctionController.update,
  )

route
  .route('/setRejected/:auctionId/:bidId')
  .patch(
    passport.authenticate('jwt', { session: false }),
    authMdw.requireSellerRole,
    bidController.isProductOwner,
    bidController.setBidStatusToRejected,
    bidController.isWinningBid,
    bidController.getPrevWinningBid,
    auctionController.update,
  )

// check auctions is exist and opening
route.param('auctionId', auctionController.checkAuctionExist)
route.param('bidId', bidController.bidById)

export default route
