import * as express from 'express'
import categoryController from '../controllers/category.controller.js'
import { uploadCategoryThumbnail } from '../middlewares/upload-category.mdw.js'
import passport from '../auth/passport.js'
import { requireAdminRole } from '../middlewares/auth.mdw.js'

const router = express.Router()

router
  .route('/')
  .get(categoryController.findAll)
  .post(
    passport.authenticate('jwt', { session: false }),
    requireAdminRole,
    uploadCategoryThumbnail.single('thumbnail'),
    categoryController.add,
  )

router
  .route('/:categoryId')
  .get(categoryController.read)
  .patch(
    passport.authenticate('jwt', { session: false }),
    requireAdminRole,
    uploadCategoryThumbnail.single('thumbnail'),
    categoryController.update,
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    requireAdminRole,
    categoryController.deleteCategory,
  )

router.param('categoryId', categoryController.categoryById)

export default router
