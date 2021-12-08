import { NextFunction, Request, Response } from 'express'
import { ErrorCode } from './error-code.js'
import { ErrorException } from './error-exception.js'
import { ErrorModel } from './error-model.js'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('Error handling middleware called.')
  console.log('Path:', req.path)
  console.error('Error occurred:', err)
  if (err instanceof ErrorException) {
    console.log('Error is known.')
    res.status(err.status).send(err)
  } else {
    // For unhandled errors.
    res
      .status(500)
      .send({ code: ErrorCode.UnknownError, status: 500 } as ErrorModel)
  }
}
