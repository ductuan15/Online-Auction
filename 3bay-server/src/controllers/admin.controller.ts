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
  // pwd: false,
  // profile: false,
  // refreshToken: false,
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = +(req.query?.page || '/') || 1

    const users = await prisma.user.findMany({
      select: userDefaultSelection,
      skip: (page - 1) * config.USER_PAGE_LIMIT,
      take: config.USER_PAGE_LIMIT,
    })
    return res.json(users)
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
      select: userDefaultSelection
    })
    return res.json(user)
  } catch (e) {
    return next(e)
  }
}