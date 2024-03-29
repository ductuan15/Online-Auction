import pkg from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { ErrorModel } from './error-model'

const { Prisma } = pkg

export const prismaErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.name === 'NotFoundError') {
    console.error(err.message)
    res.status(404).send({
      code: err.message,
      status: 404,
    } as ErrorModel)
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    console.error(err.message)
    res.status(400).send({
      code: 'Incorrect field type provided or missing field',
      status: 400,
    } as ErrorModel)
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    // TODO: Get message only
    res.status(400).send({
      code: err.message,
      status: 400,
    } as ErrorModel)
  } else {
    next(err)
  }
}
