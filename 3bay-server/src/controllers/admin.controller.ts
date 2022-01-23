import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import config from '../config/config.js'
import { ErrorException, UserError } from '../error/error-exception.js'
import { ErrorCode, UserErrorCode } from '../error/error-code.js'
import Prisma from '@prisma/client'
import { generateRefreshToken } from './auth.controller.js'
import { getAllThumbnailLink } from './images-product.controller.js'
import { ProductRes } from '../types/ProductRes.js'
import { emitProductDetails } from '../socket/product.io.js'

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
    const { name, isDisabled, verified, role } = req.query

    const where: Prisma.Prisma.UserWhereInput = {
      name: !name ? undefined : { search: `${name}` },
      isDisabled:
        !isDisabled || isDisabled === 'any' ? undefined : isDisabled === 'true',
      verified:
        !verified || verified === 'any' ? undefined : verified === 'true',
      role: !role || !(role as Prisma.Role) ? undefined : (role as Prisma.Role),
    }

    const [total, users] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        select: userDefaultSelection,
        skip: (page - 1) * limit,
        take: limit,
        where,
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

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = +(req.query?.page || '/') || 1
    const limit = +(req.query?.limit || '/') || config.PAGE_LIMIT
    const includeDeleted = req.query?.includeDeleted === 'true'
    const key = req.query.key

    let where: Prisma.Prisma.ProductWhereInput = {
      name: !key ? undefined : { search: `${key}` },
    }
    if (!includeDeleted) {
      where = { ...where, deletedAt: null }
    }

    const [total, products] = await prisma.$transaction([
      prisma.product.count({
        where: where,
      }),

      prisma.product.findMany({
        include: {
          seller: {
            select: {
              uuid: true,
              name: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        where: where,
      }),
    ])

    for (const product of products as ProductRes[]) {
      product.thumbnails = getAllThumbnailLink(product.id)
    }

    return res.json({ total, page, limit, products })
  } catch (e) {
    return next(e)
  }
}

export async function removeProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = +(req.params.id || NaN)
    if (isNaN(id)) {
      return next(new ErrorException({ code: ErrorCode.BadRequest }))
    }
    const product = await prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        auctions: {
          update: {
            where: {
              id: id,
            },
            data: {
              closeTime: new Date(),
            },
          },
        },
      },
    })

    res.json(product)
    await emitProductDetails(product.id, false)

    return
  } catch (e) {
    return next(new ErrorException({ code: ErrorCode.BadRequest }))
  }
}
