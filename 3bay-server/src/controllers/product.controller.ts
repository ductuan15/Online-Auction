import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
export const productById = async (
  req: Request,
  res: Response,
  next: NextFunction,
  value: any,
  _: string,
) => {
  try {
    req.product = await prisma.products.findUnique({
      where: {
        id: +value,
      },
      rejectOnNotFound: true,
    })
    next()
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body
    const product = await prisma.products.create({
      data: {
        name: data.name,
        sellerId: data.sellerId,
        categoryId: data.categoryId,
        currentPrice: 0,
      },
    })
    return res.status(201).json(product)
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const data = req.body
  try {
    const count = await prisma.products.update({
      data: {
        name: data.name || req.product?.name,
        categoryId: data.categoryId || req.product?.categoryId,
        currentPrice: data.currenPrice || req.product?.currentPrice,
        deletedAt: new Date() || req.product?.deletedAt,
      },
      where: { id: req.product?.id },
    })
    return res.json(count)
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}


export const read = (req: Request, res: Response) => {
  return res.json(req.product)
}
