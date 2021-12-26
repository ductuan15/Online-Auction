import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors'

import userSchema from './sign-up.js'
import signInSchema from './sign-in.js'
import resetPasswordSchema from './reset-password.js'
import accountSchema from './user-account.js'
import passwordSchema from './user-password.js'
import changeEmailSchema from './change-email.js'
import updateUserSchema from './update-user.js'
import addUserSchema from '../schemas/add-user.js'

import Prisma from '@prisma/client'

const ajv = new Ajv({ removeAdditional: true, allErrors: true })
addFormats(ajv)

ajvErrors(ajv)

ajv.addFormat('custom-date-time', function (dateTimeString) {
  if (typeof dateTimeString === 'object') {
    dateTimeString = (dateTimeString as Date).toISOString()
  }
  return !isNaN(Date.parse(dateTimeString)) // any test that returns true/false
})

ajv.addFormat('user-role', function(role) {
  role = role.trim()
  return Object.values(Prisma.Role).includes(role as Prisma.Role)
})

ajv.compile(userSchema)

export type SchemaTypes =
  | typeof userSchema
  | typeof signInSchema
  | typeof resetPasswordSchema
  | typeof accountSchema
  | typeof passwordSchema
  | typeof changeEmailSchema
  | typeof updateUserSchema
  | typeof addUserSchema

export default ajv
