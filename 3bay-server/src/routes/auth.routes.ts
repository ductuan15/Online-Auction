import * as express from 'express'
import validate from '../middlewares/ajv-validate.js'
import userSchema from '../schemas/sign-up.js'
import {signUp} from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/api/auth/user', validate(userSchema), signUp)

export default router
