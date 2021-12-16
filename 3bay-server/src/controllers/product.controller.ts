import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import {
  saveProductDetailImage,
  saveProductThumbnail,
  ensureProductImagePath,
  getThumbnailLinks,
  getDetailImageLinks,
} from './images-product.controller.js'

import config from '../config/config.js'
import { ProductRes } from '../types/ProductRes.js'
import pkg from '@prisma/client'

export const productById = async (
  req: Request,
  res: Response,
  next: NextFunction,
  value: any,
  _: string,
) => {
  try {
    const isGetDescription = req.query.isGetDescription ? true : false
    console.log(isGetDescription)
    req.product = await prisma.products.findUnique({
      where: {
        id: +value,
      },
      include: {
        auctions: true,
        product_des_history: isGetDescription,
      },
      rejectOnNotFound: true,
    })
    next()
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body
    const product: ProductRes = await prisma.products.create({
      data: {
        name: data.name,
        sellerId: data.sellerId,
        categoryId: +data.categoryId,
        currentPrice: 0,
        product_des_history: {
          create: {
            description: data.description,
          },
        },
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
        product_des_history: {
          create: {
            description: data.description,
          },
        },
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
    let products: ProductRes[] = []
    if (page) {
      products = await prisma.products.findMany({
        where: {
          categoryId: categoryId,
        },
        skip: (page - 1) * config.PAGE_LIMIT,
        take: config.PAGE_LIMIT,
      })
    }
    products.forEach(async (product) => {
      product.thumbnails = getThumbnailLinks(product.id)
      product.detail = await getDetailImageLinks(product.id)
    })
    res.status(201).json(products)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

//http://localhost:3030/api/product/search/?key=iphone&page=1&timeOrder=desc&priceOrder=acs&categoryId=5
export const search = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // https://www.prisma.io/docs/concepts/components/prisma-client/full-text-search
    // Prisma does not support MySQL FTS?  :<<
    const { key, timeOrder, priceOrder } = req.query
    const page = +(req.query?.page || '/')
    const categoryId = +(req.query?.categoryId || '')
    console.log(categoryId)
    let products: ProductRes[] = []
    if (page) {
      // WTF is this :<
      products = await prisma.$queryRaw<ProductRes[]>(
        pkg.Prisma
          .sql`SELECT * FROM products JOIN auctions on auctions.productId = products.id 
          WHERE MATCH (name) AGAINST (${key}) and 
            auctions.closeTime > CURRENT_TIMESTAMP and
            ${
              categoryId !== 0
                ? pkg.Prisma.sql`products.categoryId = ${categoryId}`
                : pkg.Prisma.empty
            }
        Order by auctions.closeTime ${
          timeOrder === 'desc' ? pkg.Prisma.sql`desc` : pkg.Prisma.empty
        }, products.currentPrice ${
          priceOrder === 'desc' ? pkg.Prisma.sql`desc` : pkg.Prisma.empty
        } LIMIT ${config.PAGE_LIMIT * (page - 1)},${config.PAGE_LIMIT * page};`,
      )
    }
    res.status(201).json(products)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const getTopPrice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products: ProductRes[] = await prisma.products.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        currentPrice: 'desc',
      },
      take: config.TOP_LIMIT,
    })
    products.forEach(async (product) => {
      product.thumbnails = getThumbnailLinks(product.id)
      product.detail = await getDetailImageLinks(product.id)
    })
    res.status(201).json(products)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}
