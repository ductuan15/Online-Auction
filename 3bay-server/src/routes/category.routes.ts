import * as express from 'express'
import categoryController from '../controllers/category.controller.js'
import { uploadCategoryThumbnail } from '../middlewares/upload-category.mdw.js'
import passport from '../auth/passport.js'

const router = express.Router()

router
  .route('/api/category')
  .get(categoryController.findAll)
  .post(
    passport.authenticate('jwt', { session: false }),
    uploadCategoryThumbnail.single('thumbnail'),
    categoryController.add,
  )

router
  .route('/api/category/:categoryId')
  .get(categoryController.read)
  .patch(
    passport.authenticate('jwt', { session: false }),
    uploadCategoryThumbnail.single('thumbnail'),
    categoryController.update,
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    categoryController.deleteCategory,
  )

router.param('categoryId', categoryController.categoryById)

export default router
