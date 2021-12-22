import * as express from 'express'
import imagesController from '../controllers/images.controller.js'

const router = express.Router()

router
  .route('/category/:categoryId/')
  .get(imagesController.findCategoryThumbnail)

router.param('categoryId', imagesController.findCategoryThumbnailById)
// router.param('categoryId', categoryController.categoryById)

export default router
