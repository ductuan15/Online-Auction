import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors'

import userSchema from './sign-up.js'
import signInSchema from './sign-in.js'

const ajv = new Ajv({ removeAdditional: true, allErrors: true })
addFormats(ajv)

ajvErrors(ajv)

ajv.addFormat('custom-date-time', function (dateTimeString) {
  if (typeof dateTimeString === 'object') {
    dateTimeString = (dateTimeString as Date).toISOString()
  }
  return !isNaN(Date.parse(dateTimeString)) // any test that returns true/false
})

ajv.compile(userSchema)

export type SchemaTypes = typeof userSchema | typeof signInSchema

export default ajv
