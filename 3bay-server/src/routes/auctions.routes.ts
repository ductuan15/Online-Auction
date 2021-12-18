import { Router } from 'express'
import * as auctionController from '../controllers/auction.controller.js'
import * as productController from '../controllers/product.controller.js'
import passport from 'passport'

const route = Router()

route
  .route('')
  .post(
    passport.authenticate('jwt', { session: false }),
    productController.isProductOwner,
    auctionController.add,
  )

route.route('/:auctionId').get(auctionController.read)

route.param('auctionId', auctionController.auctionById)

export default route
