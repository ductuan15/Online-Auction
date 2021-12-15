import e from 'express'
import prisma from '../db/prisma.js'
import { AuthError, ErrorException } from '../error/error-exception.js'
import { AuthErrorCode, ErrorCode } from '../error/error-code.js'
import Prisma from '@prisma/client'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import crypto from 'crypto'

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
        data: {
          ...req.body,
          refreshToken: crypto.randomBytes(256).toString('hex'),
        },
        select: { uuid: true },
      })
      return res.json(result)
    } catch (err) {
      return next(err)
    }
  }

  return next(new ErrorException({ code: ErrorCode.BadRequest }))
}

export async function signIn(
  req: e.Request,
  res: e.Response,
  next: e.NextFunction,
) {
  const user = req.user as Prisma.users
  if (!user.verified) {
    return next(new AuthError({ code: AuthErrorCode.NotVerified }))
  }
  if (user.isDisabled) {
    return next(new AuthError({ code: AuthErrorCode.AccountDisabled }))
  }
  const payload = {
    user: user.uuid,
    role: user.role,
  }

  const token = jwt.sign(payload, config.JWT, {
    expiresIn: '5m',
  })

  return res.json({
    user: payload.user,
    token,
    refreshToken: user.refreshToken,
    role: user.role,
  })
}
