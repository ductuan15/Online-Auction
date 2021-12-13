import e from 'express'
import prisma from '../db/prisma.js'
import { AuthError, ErrorException } from '../error/error-exception.js'
import { AuthErrorCode, ErrorCode } from '../error/error-code.js'
import bcrypt from 'bcrypt'
import config from '../config/config.js'

async function hasEmailAlreadyExisted(email: string) {
  const user = await prisma.users.findUnique({
    where: { email: email },
  })

  if (user) return true

  const admin = await prisma.admins.findUnique({
    where: { email: email },
  })

  return admin !== null && admin !== undefined
}

async function hashPassword(req: e.Request) {
  if (req.body && req.body.pwd) {
    req.body.pwd = await bcrypt.hash(req.body.pwd, config.SALT_ROUND)
  }
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
      await hashPassword(req)

      const result = await prisma.users.create({
        data: req.body,
      })
      return res.json(result)
    } catch (err) {
      return next(err)
    }
  }

  return next(new ErrorException({ code: ErrorCode.BadRequest }))
}
