import * as express from 'express'
import passport from '../auth/passport.js'
import validate from '../middlewares/ajv-validate.js'
import accountSchema from '../schemas/user-account.js'
import passwordSchema from '../schemas/user-password.js'

import {
  getAccountInfo,
  getUserScore,
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

router
  .route('/account/:id')
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

router
  .route('/password/:id')
  .post(
    passport.authenticate('jwt', { session: false }),
    validate(passwordSchema),
    ensureParamIdSameWithJWTPayload,
    hashPasswordField('newPwd'),
    updatePassword,
  )

router
  .route('/request-to-seller')
  .post(
    passport.authenticate('jwt', { session: false }),
    requireBidderRole,
    requestToSeller,
  )

router.route('/score/:id').get(getUserScore)
// router
//   .route('/score/')
//   .get(passport.authenticate('jwt', { session: false }), getUserScore)

export default router
