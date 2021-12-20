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

// router.use(passport.authenticate('jwt', { session: false }))

router
  .route('/api/user/account/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    ensureParamIdSameWithJWTPayload,
    getAccountInfo,
  )
  .post(
    passport.authenticate('jwt', { session: false }),
    validate(accountSchema),
    ensureParamIdSameWithJWTPayload,
    updateAccountInfo,
  )

router.route('/api/user/password/:id').post(
  passport.authenticate('jwt', { session: false }),
  validate(passwordSchema),
  ensureParamIdSameWithJWTPayload,
  hashPasswordField('newPwd'),
  updatePassword,
)

export default router
