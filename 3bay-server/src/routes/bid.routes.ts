import { Router } from 'express'
import passport from 'passport'
import {
  isValidBidAmount,
  isValidScore,
} from '../controllers/bid.controller.js'
import * as auctionController from '../controllers/auction.controller.js'
import * as bidController from '../controllers/bid.controller.js'
import * as authMdw from '../middlewares/auth.mdw.js'

const route = Router()

route.route('/:auctionId').post(
  // TODO: Own product bid
  // TODO: Winning bid bid again .-.
  passport.authenticate('jwt', { session: false }),
  bidController.isAuctionsClosed,
  bidController.isHavingPendingBids,
  bidController.isInBlacklist,
  isValidBidAmount,
  isValidScore,
  bidController.add,
  auctionController.update,
)

route
  .route('/setAccepcted/:auctionId/:bidId')
  .patch(
    passport.authenticate('jwt', { session: false }),
    authMdw.isAuthorized('SELLER'),
    bidController.isProductOwner,
    bidController.setBidStatusToAccepted,
    auctionController.update,
  )
route.route('/setRejected/:auctionId/:bidId').patch(
  passport.authenticate('jwt', { session: false }),
  authMdw.isAuthorized('SELLER'),
  bidController.isProductOwner,
  bidController.setBidStatusToRejected,
  bidController.isWinningBid,
  bidController.getPrevWinningBid,
  auctionController.update,
)
route.param('auctionId', auctionController.checkAuctionExist)
route.param('bidId', bidController.bidById)

export default route
