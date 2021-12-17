import * as express from 'express'
import validate from '../middlewares/ajv-validate.js'
import userSchema from '../schemas/sign-up.js'
import signInSchema from '../schemas/sign-in.js'
import resetPasswordSchema from '../schemas/reset-password.js'

import {
  refreshAccessToken,
  reSendResetPasswordOTP,
  reSendVerifyOTP,
  resetPassword,
  signIn,
  signUp,
  startResetPassword,
  startVerify,
  verifyAccount,
} from '../controllers/auth.controller.js'
import { hashPassword } from '../middlewares/auth.mdw.js'
import passport from '../auth/passport.js'

const router = express.Router()

router.post('/auth/signup', validate(userSchema), hashPassword, signUp)

router.post(
  '/auth/signin',
  validate(signInSchema),
  passport.authenticate('local', {
    session: false,
  }),
  signIn,
)

router.post('/auth/rf', refreshAccessToken)

router
  .get('/auth/verify/resend/:id', reSendVerifyOTP)
  .get('/auth/verify/:id', startVerify)
  .post('/auth/verify/:id', verifyAccount)

router
  .get('/auth/reset-pwd/resend', reSendResetPasswordOTP)
  .get('/auth/reset-pwd/', startResetPassword)
  .post(
    '/auth/reset-pwd/',
    validate(resetPasswordSchema),
    hashPassword,
    resetPassword,
  )

export default router
