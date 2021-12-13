import * as express from 'express'
import validate from '../middlewares/ajv-validate.js'
import userSchema from '../schemas/sign-up.js'
import { signUp } from '../controllers/auth.controller.js'
import { hashPassword } from '../middlewares/auth.mdw.js'

const router = express.Router()

router.post('/auth/signup', validate(userSchema), hashPassword, signUp)

export default router
