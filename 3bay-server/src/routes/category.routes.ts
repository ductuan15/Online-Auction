import * as express from 'express'
import categoryController from '../controllers/category.controller.js'

const router = express.Router()

router.route('/api/category')
  .get(categoryController.findAll)
  .post(categoryController.add)

router.route('/api/category/:categoryId')
  .get(categoryController.read)
  .patch(categoryController.update)

router.param('categoryId', categoryController.categoryById)

export default router
