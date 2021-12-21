import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import { AuthError, ErrorException } from '../error/error-exception.js'
import { AuthErrorCode, ErrorCode } from '../error/error-code.js'
import Prisma from '@prisma/client'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import crypto from 'crypto'
import {
  sendChangeEmailOTP,
  sendResetPasswordOTP,
  sendVerifyOTP,
  verifyOTP,
} from '../auth/otp.js'
import { getAccountInfo } from './user.controller.js'

async function hasEmailAlreadyExisted(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email },
  })

  if (user) return true
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    if (await hasEmailAlreadyExisted(req.body.email)) {
      return next(new AuthError({ code: AuthErrorCode.EmailAlreadyUsed }))
    }

    try {
      const result = await prisma.user.create({
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

function getUserCredential(user: Prisma.User) {
  const payload = {
    user: user.uuid,
    role: user.role,
  }

  const token = jwt.sign(payload, config.JWT, {
    expiresIn: '5m',
  })

  return {
    user: payload.user,
    name: user.name,
    token,
    refreshToken: user.refreshToken,
    role: user.role,
  }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  const user = req.user as Prisma.User
  if (!user.verified) {
    return next(
      new AuthError({
        code: AuthErrorCode.NotVerified,
        metaData: {
          uuid: user.uuid,
        },
      }),
    )
  }
  if (user.isDisabled) {
    return next(new AuthError({ code: AuthErrorCode.AccountDisabled }))
  }
  const response = getUserCredential(user)

  return res.json(response)
}

export async function refreshAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.body && req.body.refreshToken && req.body.uuid) {
    // console.log(req.body)
    try {
      const user = await prisma.user.findFirst({
        where: { refreshToken: req.body.refreshToken, uuid: req.body.uuid },
      })
      if (user) {
        return res.json(getUserCredential(user))
      }
    } catch (e) {
      return next(new ErrorException({ code: ErrorCode.UnknownError }))
    }

    return next(new AuthError({ code: AuthErrorCode.InvalidRequest }))
  }

  return next(new ErrorException({ code: ErrorCode.BadRequest }))
}

export async function startVerify(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params.id
  if (id) {
    try {
      const user = await prisma.user.findUnique({
        where: { uuid: id },
      })
      if (user && !user.verified) {
        // start the otp process
        await sendVerifyOTP(user, false)

        return res.status(200).end()
      }
    } catch (e) {
      return next(new ErrorException({ code: ErrorCode.UnknownError }))
    }
    return next(new AuthError({ code: AuthErrorCode.InvalidRequest }))
  }
  return next(new ErrorException({ code: ErrorCode.BadRequest }))
}

export async function verifyAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params.id
  const { otp: code } = req.body
  if (id && code) {
    try {
      const user = await prisma.user.findUnique({
        where: { uuid: id },
      })

      // verify the OTP code
      if (user && user.verified) {
        next(new AuthError({ code: AuthErrorCode.AlreadyVerified }))
      }

      if (user && (await verifyOTP(user, code, Prisma.OtpType.VERIFY))) {
        await prisma.user.update({
          where: { uuid: id },
          data: { verified: true },
        })

        return res.json(getUserCredential(user))
      } else {
        console.log(user)
        return next(new AuthError({ code: AuthErrorCode.WrongOTP }))
      }
    } catch (e) {
      if (e instanceof AuthError) return next(e)
      return next(new ErrorException({ code: ErrorCode.UnknownError }))
    }
  }
  return next(new ErrorException({ code: ErrorCode.BadRequest }))
}

export async function reSendVerifyOTP(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params.id

  if (id) {
    try {
      const user = await prisma.user.findUnique({
        where: { uuid: id },
      })

      if (user && !user.verified) {
        await sendVerifyOTP(user, true)
        return res.status(200).end()
      } else {
        return next(new AuthError({ code: AuthErrorCode.InvalidRequest }))
      }
    } catch (e) {
      if (e instanceof AuthError) return next(e)
      return next(new ErrorException({ code: ErrorCode.UnknownError }))
    }
  }
  return next(new ErrorException({ code: ErrorCode.BadRequest }))
}

export async function startResetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.body) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: req.body.email },
      })

      if (!user) {
        return next(new AuthError({ code: AuthErrorCode.AccountNotExist }))
      }
      if (user.isDisabled) {
        return next(new AuthError({ code: AuthErrorCode.AccountDisabled }))
      }
      if (!user.verified) {
        return next(new AuthError({ code: AuthErrorCode.NotVerified }))
      }

      // start the otp process
      await sendResetPasswordOTP(user, false)
      return res.status(200).end()
    } catch (e) {
      return next(new ErrorException({ code: ErrorCode.UnknownError }))
    }
  }

  return next(new ErrorException({ code: ErrorCode.BadRequest }))
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { otp: code, pwd, email } = req.body
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    })

    // verify OTP code
    if (user && (await verifyOTP(user, code, Prisma.OtpType.CHANGE_PWD))) {
      await prisma.user.update({
        where: { email: email },
        data: { pwd: pwd },
      })

      return res.json(getUserCredential(user))
    } else {
      console.log(user)
      return next(new AuthError({ code: AuthErrorCode.WrongOTP }))
    }
  } catch (e) {
    console.log(e)
    if (e instanceof AuthError) return next(e)
    return next(new ErrorException({ code: ErrorCode.UnknownError }))
  }
}

export async function reSendResetPasswordOTP(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.body) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: req.body.email },
      })

      if (user && user.verified && !user.isDisabled) {
        // start the otp process
        await sendResetPasswordOTP(user, true)
        return res.status(200).end()
      }
    } catch (e) {
      if (e instanceof AuthError) return next(e)
      return next(new ErrorException({ code: ErrorCode.UnknownError }))
    }
  }
  return next(new ErrorException({ code: ErrorCode.BadRequest }))
}

export async function startChangingEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = req.user as Prisma.User

  try {
    const hasEmail = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    })
    if (hasEmail) {
      return next(new AuthError({ code: AuthErrorCode.EmailAlreadyUsed }))
    }

    await sendChangeEmailOTP(user, false, req.body.email)
    return res.status(200).end()
  } catch (e) {
    return next(new AuthError({ code: AuthErrorCode.InvalidRequest }))
  }
}

export async function resendChangeEmailOtp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = req.user as Prisma.User
  try {
    await sendChangeEmailOTP(user, true)
    return res.status(200).end()
  } catch (e) {
    if (e instanceof AuthError) {
      return next(e)
    }
    return next(new AuthError({ code: AuthErrorCode.InvalidRequest }))
  }
}

export async function verifyNewEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = req.user as Prisma.User
  // console.log(req.body)
  try {
    const hasEmail = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    })
    if (hasEmail) {
      return next(new AuthError({ code: AuthErrorCode.EmailAlreadyUsed }))
    }
    if (
      await verifyOTP(
        user,
        req.body.otp,
        Prisma.OtpType.CHANGE_EMAIL,
        req.body.email,
      )
    ) {
      await prisma.user.update({
        where: {
          uuid: user.uuid,
        },
        data: {
          email: req.body.email,
        },
      })
      return getAccountInfo(req, res)
    }
    return next(new AuthError({ code: AuthErrorCode.WrongOTP }))
  } catch (e) {
    console.log(e)
    if (e instanceof AuthError) {
      return next(e)
    }
    return next(new AuthError({ code: AuthErrorCode.InvalidRequest }))
  }
}