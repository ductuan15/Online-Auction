import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import {
  saveProductDetailImage,
  saveProductThumbnail,
  ensureProductImagePath,
  getThumbnailLinks,
  getDetailImageLinks,
} from './images-product.controller.js'

import { products } from '@prisma/client'
import config from '../config/config.js'

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
  } catch (erroror) {
    if (erroror instanceof Error) {
      next(erroror)
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
  } catch (error) {
    if (error instanceof Error) {
      next(error)
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
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.product) {
      req.product.thumbnails = getThumbnailLinks(req.product.id)
      req.product.detail = await getDetailImageLinks(req.product.id)
    }
    return res.json(req.product)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const getProductByCategoryId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryId = +req.params.categoryId
    const page = +(req.query?.page || '/')
    let products: products[] = []
    if (page) {
      products = await prisma.products.findMany({
        where: {
          categoryId: categoryId,
        },
        skip: (page - 1) * config.PAGE_LIMIT,
        take: config.PAGE_LIMIT,
      })
    }
    res.status(201).json(products)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const search = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // https://www.prisma.io/docs/concepts/components/prisma-client/full-text-search
    // Prisma does not support MySQL FTS?  :<<
    const key = req.query
    const page = +(req.query?.page || '/')
    let products: products[] = []
    if (page) {
      products = await prisma.$queryRaw<
        products[]
      >`SELECT * FROM products WHERE MATCH (name) AGAINST (${key}) LIMIT ${
        config.PAGE_LIMIT * (+(page || 1) - 1)
      },${config.PAGE_LIMIT * +(page || 1)};`
    }
    res.status(201).json(products)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}
