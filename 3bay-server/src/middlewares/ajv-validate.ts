import * as express from 'express'
import ajv, { SchemaTypes } from '../schemas/ajv.js'
import { ErrorException } from '../error/error-exception.js'
import { ErrorCode } from '../error/error-code.js'

const validate = (schema: SchemaTypes) => {
  return function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const valid = ajv.validate(schema, req.body)
    if (!valid) {
      // console.log(ajv.errors)
      let msg = ''
      if (ajv.errors && ajv.errors.length > 0) {
        msg = ajv.errors[0].message || ''
        return next(
          new ErrorException({
            code: ErrorCode.BadRequest,
            message: msg,
            metaData: ajv.errors,
          }),
        )
      }
      return res.status(400).json(ajv.errors)
    }
    next()
  }
}
export default validate
