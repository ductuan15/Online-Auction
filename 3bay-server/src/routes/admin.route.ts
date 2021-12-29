import * as express from 'express'
import passport from '../auth/passport.js'
import { hashPassword, requireAdminRole } from '../middlewares/auth.mdw.js'
import {
  deleteUser,
  getProducts,
  getRequestSellerUsers,
  getUsers,
  removeProduct,
  updateUser,
} from '../controllers/admin.controller.js'
import validate from '../middlewares/ajv-validate.js'
import updateUserSchema from '../schemas/update-user.js'
import addUserSchema from '../schemas/add-user.js'
import { signUp } from '../controllers/auth.controller.js'

const router = express.Router()

router.use(passport.authenticate('jwt', { session: false }), requireAdminRole)

router
  .route('/users')
  .get(getUsers)
  .patch(validate(updateUserSchema), updateUser)
  .post(validate(addUserSchema), hashPassword, signUp)

router.route('/users/:id').delete(deleteUser)

router.route('/users/request-seller').get(getRequestSellerUsers)

router.route('/products/').get(getProducts)

router.route('/products/:id').delete(removeProduct)

export default router
