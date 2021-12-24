import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import config from '../config/config.js'

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
    return res.json({ total, page, users })
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
    const { uuid, ...data } = req.body
    const user = await prisma.user.update({
      where: { uuid: uuid },
      data: { ...data },
      select: userDefaultSelection,
    })
    return res.json(user)
  } catch (e) {
    return next(e)
  }
}
