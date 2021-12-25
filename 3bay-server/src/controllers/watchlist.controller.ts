import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'

export const getWatchListByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let watchlist = await prisma.userWatchlist.findMany({
      where: {
        userId: req.user?.uuid || '',
      },
      include: {
        products: true,
      },
    })
    return res.json(watchlist)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = +req.params.productId
    const watchList = await prisma.userWatchlist.create({
      data: {
        userId: req.user?.uuid || '',
        productId: productId
      },
    })
    return res.status(201).json(watchList)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const deleteWatchList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = +req.params.productId
    const watchList = await prisma.userWatchlist.delete({
      where: {
        userId_productId: {
          userId: req.user?.uuid || '',
          productId: productId
        }
      },
    })
    return res.status(201).json(watchList)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}
