import { Router } from 'express'
import passport from '../auth/passport.js'
import * as productController from '../controllers/product.controller.js'
import { uploadProductImages } from '../middlewares/upload-product.mdw.js'

const router = Router()
const uploadProductImagesFields = [
  {
    name: 'thumbnail',
    maxCount: 1,
  },
  {
    name: 'detail',
    maxCount: 6,
  },
]

router
  .route('/')
  .post(
    passport.authenticate('jwt', { session: false }),
    uploadProductImages.fields(uploadProductImagesFields),
    productController.add,
  )

router.route('/search').get(productController.search)

router
  .route('/byCategory/:categoryId')
  .get(productController.getProductByCategoryId)

router.route('/top/price').get(productController.getTopPrice)

router
  .route('/:productId')
  .get(productController.read)
  .patch(
    passport.authenticate('jwt', { session: false }),
    productController.isProductOwner,
    uploadProductImages.fields(uploadProductImagesFields),
    productController.update,
  )


router.param('productId', productController.productById)

export default router
