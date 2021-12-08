import { Router } from 'express'
import * as productController from '../controllers/product.controller.js'

const router = Router()

router.route('/').post(productController.add)

router
  .route('/:productId')
  .get(productController.read)
  .patch(productController.update)

router.param('productId', productController.productById)

export default router
