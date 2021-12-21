import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import config, { recaptchaConfig } from '../config/config.js'
import axios from 'axios'
import { AuthError } from '../error/error-exception.js'
import { AuthErrorCode } from '../error/error-code.js'
import Prisma from '@prisma/client'

/**
 * Hash the raw password (from req.body.pwd) by using bcrypt
 * @param req
 * @param res
 * @param next
 */
export async function hashPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.body && req.body.pwd) {
    req.body.pwd = await bcrypt.hash(req.body.pwd, config.SALT_ROUND)
  }
  next()
}

export function hashPasswordField(fieldName: string) {
  return async function hashPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (req.body && req.body[fieldName]) {
      req.body[fieldName] = await bcrypt.hash(req.body[fieldName], config.SALT_ROUND)
    }
    next()
  }
}

export async function verifyRecaptcha(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!recaptchaConfig.IS_ENABLED || recaptchaConfig.SECRET_KEY.length === 0) {
    // No need captchaToken anymore
    if (req.body) {
      delete req.body.captchaToken
    }

    return next()
  }
  try {
    if (
      req.body &&
      req.body.captchaToken &&
      req.body.captchaToken.length !== 0
    ) {
      // Call Google's API to get score
      // console.log(
      //   `https://www.google.com/recaptcha/api/siteverify` +
      //     `?secret=${recaptchaConfig.SECRET_KEY}&response=${req.body.captchaToken}`,
      // )
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify` +
          `?secret=${recaptchaConfig.SECRET_KEY}&response=${req.body.captchaToken}`,
      )

      if (response.data.success) {
        console.log('Recaptcha verified successfully')
        // No need captchaToken anymore
        delete req.body.captchaToken
        return next()
      }
    }
  } catch (e) {
    console.log(e)
  }

  return next(new AuthError({ code: AuthErrorCode.RecaptchaFailed }))
}

export function ensureParamIdSameWithJWTPayload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user: Partial<Prisma.User> = req.user as Prisma.User
  if (user.uuid !== req.params.id) {
    return next(new AuthError({ code: AuthErrorCode.InvalidRequest }))
  }
  next()
}

export function isAuthorize(role: keyof typeof Prisma.Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(role, req.user?.role)

    if (req.user?.role === role) {
      return next()
    }
    //New Auth Error Code
    return next(
      new AuthError({
        code: `This action is only for ${role}`,
      }),
    )
  }
}