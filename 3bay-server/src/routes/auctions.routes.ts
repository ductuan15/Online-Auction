import { Router } from 'express'
import * as auctionController from '../controllers/auction.controller.js'
import * as productController from '../controllers/product.controller.js'
import * as authMdw from '../middlewares/auth.mdw.js'
import passport from 'passport'

const route = Router()

route
  .route('/byProduct/:productId')
  .post(
    passport.authenticate('jwt', { session: false }),
    authMdw.isAuthorized('SELLER'),
    productController.isProductOwner,
    auctionController.add,
  )
  .get(auctionController.auctionsByProductId)

route
  .route('/byProduct/latestAuction/:productId')
  .get(auctionController.getLatestAuction)
route.route('/:auctionId').get(auctionController.read)

route.param('auctionId', auctionController.auctionById)
route.param('productId', productController.checkProductExist)

export default route
