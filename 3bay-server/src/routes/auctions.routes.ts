import { Router } from 'express'
import * as auctionController from '../controllers/auction.controller.js'
import * as productController from '../controllers/product.controller.js'
import * as authMdw from '../middlewares/auth.mdw.js'
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

router
  .route('/userStatus/:auctionId')
  .get(
    passport.authenticate('jwt', { session: false }),
    auctionController.getUserBidStatus,
  )

router
  .route('/seller/review/:auctionId')
  .patch(
    passport.authenticate('jwt', { session: false }),
    auctionController.isProductOwner,
    auctionController.updataSellerReview,
  )
router.route('/bidder/review/:auctionId')
.patch(
  passport.authenticate('jwt', { session: false }),
  auctionController.isAuctionWinner,
  auctionController.updataBidderReview
)
router.route('/:auctionId').get(auctionController.read)

router.param('auctionId', auctionController.auctionById)
router.param('productId', productController.checkProductExist)

export default router
