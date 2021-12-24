import * as express from 'express'
import passport from '../auth/passport.js'
import { requireAdminRole } from '../middlewares/auth.mdw.js'
import { getUsers, updateUser } from '../controllers/admin.controller.js'
import validate from '../middlewares/ajv-validate.js'
import updateUserSchema from '../schemas/update-user.js'

const router = express.Router()

router.use(passport.authenticate('jwt', { session: false }), requireAdminRole)

router.route('/users').get(getUsers).post(
  validate(updateUserSchema),
  updateUser
)

export default router
