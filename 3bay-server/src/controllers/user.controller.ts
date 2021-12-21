import { NextFunction, Request, Response } from 'express'
import Prisma from '@prisma/client'
import { AuthError } from '../error/error-exception.js'
import { AuthErrorCode } from '../error/error-code.js'
import prisma from '../db/prisma.js'
import { verifyPassword } from '../auth/passport.js'

function removePrivateData(user: Partial<Prisma.User>) {
  delete user.verified
  delete user.refreshToken
  delete user.isDisabled
  delete user.pwd
}

export async function getAccountInfo(req: Request, res: Response) {
  const user: Partial<Prisma.User> = req.user as Prisma.User

  removePrivateData(user)

  return res.json(user)
}

export async function updateAccountInfo(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // const user: Partial<Prisma.User> = req.user as Prisma.User

  try {
    let response: Partial<Prisma.User> = await prisma.user.update({
      where: {
        uuid: req.params.id,
      },
      data: {
        // ...user,
        ...req.body,
      },
    })

    if (!response) {
      return next(new AuthError({ code: AuthErrorCode.AccountNotExist }))
    }

    removePrivateData(response)
    res.json(response)

    return res.json()
  } catch (e) {
    if (
      e instanceof Prisma.Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002' // &&
      // e.meta?.target === 'email'
    ) {
      // console.log(e.meta)
      return next(new AuthError({ code: AuthErrorCode.EmailAlreadyUsed }))
    }

    return next(e)
  }
}

export async function updatePassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user: Prisma.User = req.user as Prisma.User

  if (!(await verifyPassword(user, req.body.pwd))) {
    // console.log(req.body.pwd)
    return next(new AuthError({ code: AuthErrorCode.WrongPassword }))
  }

  try {
    let response: Partial<Prisma.User> = await prisma.user.update({
      where: {
        uuid: req.params.id,
      },
      data: {
        pwd: req.body.newPwd,
      },
    })

    if (!response) {
      return next(new AuthError({ code: AuthErrorCode.AccountNotExist }))
    }

    removePrivateData(response)
    res.json(response)

    return res.json()
  } catch (e) {
    return next(e)
  }
}
