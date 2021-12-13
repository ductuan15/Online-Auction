import e from 'express'
import prisma from '../db/prisma.js'
import { AuthError, ErrorException } from '../error/error-exception.js'
import { AuthErrorCode, ErrorCode } from '../error/error-code.js'

async function hasEmailAlreadyExisted(email: string) {
  const user = await prisma.users.findUnique({
    where: { email: email },
  })

  if (user) return true
}

export async function signUp(
  req: e.Request,
  res: e.Response,
  next: e.NextFunction,
) {
  if (req.body) {
    if (await hasEmailAlreadyExisted(req.body.email)) {
      return next(new AuthError({ code: AuthErrorCode.EmailAlreadyUsed }))
    }

    try {
      const result = await prisma.users.create({
        data: req.body,
        select: { uuid: true },
      })
      return res.json(result)
    } catch (err) {
      return next(err)
    }
  }

  return next(new ErrorException({ code: ErrorCode.BadRequest }))
}
