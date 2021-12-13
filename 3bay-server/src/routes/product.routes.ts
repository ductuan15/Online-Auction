import { Router } from 'express'
import categoryController from '../controllers/category.controller.js'
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
    uploadProductImages.fields(uploadProductImagesFields),
    productController.add,
  )

router.route('/byCategory/:categoryId')
.get(productController.getProductByCategoryId);

router
  .route('/:productId')
  .get(productController.read)
  .patch(
    uploadProductImages.fields(uploadProductImagesFields),
    productController.update,
  )

router.param('productId', productController.productById)

export default router
