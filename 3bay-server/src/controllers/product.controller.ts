import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import {
  saveProductDetailImage,
  saveProductThumbnail,
  ensureProductImagePath,
  getThumbnailLinks,
  getDetailImageLinks,
} from './images-product.controller.js'
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
        sellerId: +data.sellerId,
        categoryId: +data.categoryId,
        currentPrice: 0,
      },
    })
    await ensureProductImagePath(product.id)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    if (req.files) {
      await saveProductThumbnail(files['thumbnail'][0], product.id)
      await saveProductDetailImage(files['detail'], product.id)
    }
    return res.status(201).json(product)
  } catch (err) {
    console.error(err)
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
        categoryId: +data.categoryId || req.product?.categoryId,
        currentPrice: +data.currenPrice || req.product?.currentPrice,
        deletedAt: new Date() || req.product?.deletedAt,
      },
      where: { id: +(req.product?.id || '') },
    })
    if (req.product) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }
      if (data.isUpdateThumbnail && files['thumbnail'].length > 0) {
        await saveProductThumbnail(files['thumbnail'][0], req.product.id)
      }
      if (data.isUpdateDetailImage && files['detail'].length > 0) {
        await saveProductDetailImage(files['detail'], req.product.id)
      }
    }
    return res.json(count)
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const read = async (req: Request, res: Response) => {
  if (req.product) {
    req.product.thumbnails = getThumbnailLinks(req.product.id)
    req.product.detail = await getDetailImageLinks(req.product.id)
  }
  return res.json(req.product)
}
