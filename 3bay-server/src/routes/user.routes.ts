import * as express from 'express'
import passport from '../auth/passport.js'
import validate from '../middlewares/ajv-validate.js'
import accountSchema from '../schemas/user-account.js'
import passwordSchema from '../schemas/user-password.js'

import {
  getAccountInfo,
  updateAccountInfo,
  updatePassword,
} from '../controllers/user.controller.js'
import {
  ensureParamIdSameWithJWTPayload,
  hashPasswordField,
} from '../middlewares/auth.mdw.js'

const router = express.Router()

router.use(
  passport.authenticate('jwt', { session: false }),
  // ensureParamIdSameWithJWTPayload,
)

router
  .route('/account/:id')
  .get(
    ensureParamIdSameWithJWTPayload,
    getAccountInfo,
  )
  .post(
    validate(accountSchema),
    ensureParamIdSameWithJWTPayload,
    updateAccountInfo,
  )

router.route('/password/:id').post(
  validate(passwordSchema),
  ensureParamIdSameWithJWTPayload,
  hashPasswordField('newPwd'),
  updatePassword,
)

export default router
