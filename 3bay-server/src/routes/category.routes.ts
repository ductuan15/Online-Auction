import * as express from 'express'
import categoryController from '../controllers/category.controller.js'
import { uploadCategoryThumbnail } from '../middlewares/upload-category.mdw.js'

const router = express.Router()

router.route('/api/category')
  .get(categoryController.findAll)
  .post(uploadCategoryThumbnail.single('thumbnail'), categoryController.add)

router.route('/api/category/:categoryId')
  .get(categoryController.read)
  .patch(uploadCategoryThumbnail.single('thumbnail'), categoryController.update)
  .delete(categoryController.deleteCategory)

router.param('categoryId', categoryController.categoryById)

export default router
