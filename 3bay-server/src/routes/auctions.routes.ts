import { Router } from 'express'
import * as auctionController from '../controllers/auction.controller.js'
import * as productController from '../controllers/product.controller.js'
import * as authMdw from '../middlewares/auth.mdw.js'
import * as auctionMdw from '../middlewares/auction.mdw.js'

import passport from 'passport'

const router = Router()

router
  .route('/byProduct/:productId')
  .post(
    passport.authenticate('jwt', { session: false }),
    authMdw.requireSellerRole,
    productController.isProductOwner,
    auctionController.add,
  )
  .get(auctionController.auctionsByProductId)

router
  .route('/byProduct/latestAuction/:productId')
  .get(auctionController.getLatestAuction)

router.route('/userStatus/setAccepted/:auctionId/:userId').patch(
  passport.authenticate('jwt', { session: false }),
  authMdw.requireSellerRole,
  auctionController.isAuctionClosed,
  auctionController.isProductOwner,
  auctionMdw.processBidRequest(true),
  auctionMdw.notifyWhenBidRequestProceed(true),
)

router.route('/userStatus/setRejected/:auctionId/:userId').patch(
  passport.authenticate('jwt', { session: false }),
  authMdw.requireSellerRole,
  auctionController.isAuctionClosed,
  auctionController.isProductOwner,
  auctionMdw.processBidRequest(false),
  auctionMdw.notifyWhenBidRequestProceed(false),
)

router
  .route('/userStatus/:auctionId')
  .get(
    passport.authenticate('jwt', { session: false }),
    auctionController.getUserBidStatus,
  )
  .post(
    passport.authenticate('jwt', { session: false }),
    auctionController.isNotProductOwner,
    auctionController.requestBidPermission,
    auctionController.getUserBidStatus,
  )

router
  .route('/close/:auctionId')
  .patch(
    passport.authenticate('jwt', { session: false }),
    auctionController.isProductOwner,
    auctionController.closeAuction,
  )

router
  .route('/joined')
  .get(
    passport.authenticate('jwt', { session: false }),
    auctionController.getJoinedAuction,
  )
router
  .route('/won')
  .get(
    passport.authenticate('jwt', { session: false }),
    auctionController.getWonAuction,
  )
router
  .route('/has-winner')
  .get(
    passport.authenticate('jwt', { session: false }),
    authMdw.requireSellerRole,
    auctionController.getHasWinnerAuction,
  )
router
  .route('/opening')
  .get(
    passport.authenticate('jwt', { session: false }),
    authMdw.requireSellerRole,
    auctionController.getOpeningAuction,
  )

router
  .route('/seller/review/:auctionId')
  .patch(
    passport.authenticate('jwt', { session: false }),
    auctionController.isProductOwner,
    auctionController.updateSellerReview,
  )

router
  .route('/seller/bidRequest/:auctionId')
  .get(
    passport.authenticate('jwt', { session: false }),
    auctionController.isProductOwner,
    auctionController.getBidRequestList,
  )

router
  .route('/bidder/review/:auctionId')
  .patch(
    passport.authenticate('jwt', { session: false }),
    auctionController.isAuctionWinner,
    auctionController.updateBidderReview,
  )

router.route('/:auctionId').get(auctionController.read)

router.param('auctionId', auctionController.auctionById)
router.param('productId', productController.checkProductExist)

export default router
