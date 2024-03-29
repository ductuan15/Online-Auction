import * as express from 'express'
import validate from '../middlewares/ajv-validate.js'
import userSchema from '../schemas/sign-up.js'
import signInSchema from '../schemas/sign-in.js'
import changeEmailSchema from '../schemas/change-email.js'
import resetPasswordSchema from '../schemas/reset-password.js'

import {
  refreshAccessToken, resendChangeEmailOtp,
  reSendResetPasswordOTP,
  reSendVerifyOTP,
  resetPassword,
  signIn,
  signUp, startChangingEmail,
  startResetPassword,
  startVerify,
  verifyAccount, verifyNewEmail,
} from '../controllers/auth.controller.js'
import { hashPassword, verifyRecaptcha } from '../middlewares/auth.mdw.js'
import passport from '../auth/passport.js'
import { getAccountInfo } from '../controllers/user.controller.js'

const router = express.Router()

router.post(
  '/signup',
  validate(userSchema),
  verifyRecaptcha,
  hashPassword,
  signUp,
)

router.post(
  '/signin',
  validate(signInSchema),
  passport.authenticate('local', {
    session: false,
  }),
  signIn,
)

router.post('/rf', refreshAccessToken)

router
  .get('/verify/resend/:id', reSendVerifyOTP)
  .get('/verify/:id', startVerify)
  .post('/verify/:id', verifyAccount)

router
  .post('/reset-pwd/resend', reSendResetPasswordOTP)
  .post('/reset-pwd/request', startResetPassword)
  .post(
    '/reset-pwd/',
    validate(resetPasswordSchema),
    hashPassword,
    resetPassword,
  )

router
  .post(
    '/change-email/resend/',
    passport.authenticate('jwt', {
      session: false,
    }),
    resendChangeEmailOtp
  )
  .post(
    '/change-email/verify/',
    passport.authenticate('jwt', {
      session: false,
    }),
    validate(changeEmailSchema),
    verifyNewEmail,
    getAccountInfo,
  )
  .post(
    '/change-email/',
    passport.authenticate('jwt', {
      session: false,
    }),
    validate(changeEmailSchema),
    startChangingEmail
  )

export default router
