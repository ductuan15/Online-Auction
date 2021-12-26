import * as express from 'express'
import passport from '../auth/passport.js'
import validate from '../middlewares/ajv-validate.js'
import accountSchema from '../schemas/user-account.js'
import passwordSchema from '../schemas/user-password.js'

import {
  getAccountInfo,
  requestToSeller,
  updateAccountInfo,
  updatePassword,
} from '../controllers/user.controller.js'
import {
  ensureParamIdSameWithJWTPayload,
  hashPasswordField,
  requireBidderRole,
} from '../middlewares/auth.mdw.js'

const router = express.Router()

router.use(
  passport.authenticate('jwt', { session: false }),
  // ensureParamIdSameWithJWTPayload,
)

router
  .route('/account/:id')
  .get(ensureParamIdSameWithJWTPayload, getAccountInfo)
  .post(
    validate(accountSchema),
    ensureParamIdSameWithJWTPayload,
    updateAccountInfo,
  )

router
  .route('/password/:id')
  .post(
    validate(passwordSchema),
    ensureParamIdSameWithJWTPayload,
    hashPasswordField('newPwd'),
    updatePassword,
  )

router.route('/request-to-seller').post(requireBidderRole, requestToSeller)

export default router
