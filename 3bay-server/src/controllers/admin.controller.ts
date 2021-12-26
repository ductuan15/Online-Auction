import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import config from '../config/config.js'
import { ErrorException, UserError } from '../error/error-exception.js'
import { ErrorCode, UserErrorCode } from '../error/error-code.js'
import Prisma from '@prisma/client'
import { generateRefreshToken } from './auth.controller.js'

const userDefaultSelection = {
  uuid: true,
  name: true,
  email: true,
  isDisabled: true,
  role: true,
  dob: true,
  verified: true,
  address: true,
  profile: true,
  // pwd: false,
  // refreshToken: false,
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = +(req.query?.page || '/') || 1
    const limit = +(req.query?.limit || '/') || config.USER_PAGE_LIMIT

    const [total, users] = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.findMany({
        select: userDefaultSelection,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])
    return res.json({ total, page, limit, users })
  } catch (e) {
    return next(e)
  }
}

export async function getRequestSellerUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = +(req.query?.page || '/') || 1
    const limit = +(req.query?.limit || '/') || config.USER_PAGE_LIMIT

    const [total, users] = await prisma.$transaction([
      prisma.upgradeToSellerRequest.count(),
      prisma.user.findMany({
        // select: { user: { select: userDefaultSelection } },
        select: userDefaultSelection,
        where: {
          role: Prisma.Role.BIDDER,
          upgradeToSellerRequest: {
            is: {},
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])
    return res.json({ total, page, limit, users })
  } catch (e) {
    return next(e)
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { uuid, cancelUpgradeToSellerRequest, ...data } = req.body
    if (data.role === Prisma.Role.SELLER || cancelUpgradeToSellerRequest) {
      const hasSellerRequest = await prisma.upgradeToSellerRequest.findUnique({
        where: { userId: uuid },
      })
      if (hasSellerRequest) {
        await prisma.upgradeToSellerRequest.delete({
          where: {
            userId: uuid,
          },
        })
      }
    }

    const user = await prisma.user.update({
      where: { uuid: uuid },
      data: { ...data, refreshToken: generateRefreshToken() },
      select: userDefaultSelection,
    })
    return res.json(user)
  } catch (e) {
    return next(e)
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const uuid = req.params.id
    if (!uuid) {
      return next(new ErrorException({ code: ErrorCode.BadRequest }))
    }
    const user = await prisma.user.delete({
      where: { uuid: uuid },
    })
    return res.json(user)
  } catch (e) {
    if (e instanceof Prisma.Prisma.PrismaClientKnownRequestError) {
      return next(new UserError({ code: UserErrorCode.CannotDeleteUser }))
    }
    return next(new ErrorException({ code: ErrorCode.UnknownError }))
  }
}
