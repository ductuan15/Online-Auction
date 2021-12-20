import * as express from 'express'
import * as imageProductController from '../controllers/images-product.controller.js'

const router = express.Router()

router.route('/:productId').get(imageProductController.findProductThumbnail)
router.route('/:productId/detail/:index').get(imageProductController.findProductDetailImage)
export default router
