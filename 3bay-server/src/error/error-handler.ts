import { NextFunction, Request, Response } from 'express'
import { ErrorCode } from './error-code.js'
import { ErrorException } from './error-exception.js'
import { ErrorModel } from './error-model.js'
import c from 'ansi-colors'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log(c.red('Error handling middleware called.'))
  console.log(c.red('Path:'), c.bgRed(req.path))
  console.error('Error occurred:', c.redBright(JSON.stringify(err, null, 2)))
  if (err instanceof ErrorException) {
    console.log(c.yellow('Error is known.'))
    res.status(err.status).send(err)
  } else {
    // For unhandled errors.
    res
      .status(500)
      .send({ code: ErrorCode.UnknownError, status: 500 } as ErrorModel)
  }
}
