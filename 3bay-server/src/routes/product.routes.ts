import { Router } from 'express'
import passport from '../auth/passport.js'
import * as productController from '../controllers/product.controller.js'
import {uploadProductImagesFields} from '../controllers/product.controller.js'
import { uploadProductImages } from '../middlewares/upload-product.mdw.js'
import { requireSellerRole } from '../middlewares/auth.mdw.js'

const router = Router()

router
  .route('/')
  .post(
    passport.authenticate('jwt', { session: false }),
    requireSellerRole,
    uploadProductImages.fields(Object.values(uploadProductImagesFields)),
    productController.add,
  )

router.route('/postedProducts')
    .get(
        passport.authenticate('jwt', { session: false }),
        requireSellerRole,
        productController.getPostedProductList
    )

router.route('/search').get(productController.search)

router
  .route('/byCategory/:categoryId')
  .get(productController.getProductByCategoryId)

router.route('/top/price').get(productController.getTopPrice)
// :< Separate words with hyphens but too late,, sorry mng
router.route('/top/bidNumber').get(productController.getTopNumberBid)
router.route('/top/closeTime').get(productController.getTopCloseTime)

router
  .route('/:productId')
  .get(productController.read)
  .patch(
    passport.authenticate('jwt', { session: false }),
    requireSellerRole,
    productController.isProductOwner,
    uploadProductImages.fields(Object.values(uploadProductImagesFields)),
    productController.update,
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    requireSellerRole,
    productController.isProductOwner,
    productController.deleteProduct,
  )

router.param('productId', productController.productById)

export default router
