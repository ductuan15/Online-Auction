import { NextFunction, Request, Response } from 'express'
import Prisma from '@prisma/client'
import { AuthError, ErrorException } from '../error/error-exception.js'
import { AuthErrorCode, ErrorCode } from '../error/error-code.js'
import prisma from '../db/prisma.js'
import { verifyPassword } from '../auth/passport.js'
import { getScore } from './bid.controller.js'
import config from '../config/config.js'
import { ProductRes } from '../types/ProductRes.js'
import { getAllThumbnailLink } from './images-product.controller.js'

function removePrivateData(user: Partial<Prisma.User>) {
  delete user.verified
  delete user.refreshToken
  delete user.isDisabled
  delete user.pwd
}

export async function getAccountInfo(req: Request, res: Response) {
  const user: Partial<Prisma.User> = req.user as Prisma.User
  const notifications = await prisma.notifications.findMany({
    include: {
      data: {
        select: {
          id: true,
          sellerId: true,
          name: true,
        },
      },
    },
    where: {
      uuid: user.uuid,
    },
    take: config.NOTIFICATION_LIMIT,
    orderBy: [
      {
        date: 'desc',
      },
    ],
  })

  for (const { data } of notifications) {
    (data as ProductRes).thumbnails = getAllThumbnailLink(data.id)
  }

  removePrivateData(user)

  return res.json({ ...user, notifications })
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

export async function requestToSeller(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user: Prisma.User = req.user as Prisma.User
  try {
    const data = { userId: user.uuid }
    const response = await prisma.upgradeToSellerRequest.upsert({
      create: { ...data },
      update: { ...data },
      where: { ...data },
    })
    return res.json(response)
  } catch (e) {
    return next(new ErrorException({ code: ErrorCode.UnknownError }))
  }
}

export async function getUserScore(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let score
    if (req.params.id) {
      score = await getScore(req.params.id)
    }

    res.json({ score })
  } catch (e) {
    if (e instanceof Error) {
      next(e)
    }
  }
}
