import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import {
  ensureProductImagePath,
  getAllDetailImageLinks,
  getAllThumbnailLink,
  getThumbnailUrl,
  saveProductDetailImage,
  saveProductThumbnail,
} from './images-product.controller.js'

import config from '../config/config.js'
import { ProductRes } from '../types/ProductRes.js'
import Prisma from '@prisma/client'

export const productById = async (
  req: Request,
  res: Response,
  next: NextFunction,
  value: any,
  _: string,
) => {
  try {
    const isWithDescription = !!req.query.isWithDescription
    console.log(isWithDescription)
    req.product = await prisma.product.findUnique({
      where: {
        id: +value,
      },
      include: {
        auctions: {
          where: {
            closeTime: null,
          },
        },
        productDescriptionHistory: isWithDescription,
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
    const product: ProductRes = await prisma.product.create({
      data: {
        name: data.name,
        sellerId: req.user?.uuid || '',
        categoryId: +data.categoryId,
        currentPrice: 0,
        productDescriptionHistory: {
          create: {
            description: data.description,
          },
        },
      },
    })
    await ensureProductImagePath(product.id)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    if (req.files) {
      await saveProductThumbnail(files['thumbnail'], product.id)
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
    const count = await prisma.product.update({
      data: {
        name: data.name || req.product?.name,
        categoryId: +data.categoryId || req.product?.categoryId,
        currentPrice: +data.currenPrice || req.product?.currentPrice,
        deletedAt: new Date() || req.product?.deletedAt,
        productDescriptionHistory: {
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
        await saveProductThumbnail(files['thumbnail'], req.product.id)
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
      req.product.thumbnails = getAllThumbnailLink(req.product.id);
      req.product.detail = await getAllDetailImageLinks(req.product.id)
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
      products = await prisma.product.findMany({
        where: {
          categoryId: categoryId,
        },
        skip: (page - 1) * config.PAGE_LIMIT,
        take: config.PAGE_LIMIT,
      })
    }
    products.forEach(async (product) => {
      product.thumbnails = getAllThumbnailLink(product.id)
      product.detail = await getAllDetailImageLinks(product.id)
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
      // it's not that bad tbh. More readable than your `best-friend`'s code, obviously
      products = await prisma.$queryRaw<ProductRes[]>(
        Prisma.Prisma.sql`SELECT *
                          FROM products
                                   JOIN auctions on auctions.productId = products.id
                          WHERE MATCH (name) AGAINST (${key})
                            and
                              auctions.closeTime
                              > CURRENT_TIMESTAMP
                            and ${
                              categoryId !== 0
                                ? Prisma.Prisma
                                    .sql`products.categoryId = ${categoryId}`
                                : Prisma.Prisma.empty
                            }
                          Order by auctions.closeTime ${
                            timeOrder === 'desc'
                              ? Prisma.Prisma.sql`desc`
                              : Prisma.Prisma.empty
                          }, products.currentPrice ${
          priceOrder === 'desc' ? Prisma.Prisma.sql`desc` : Prisma.Prisma.empty
        } LIMIT ${config.PAGE_LIMIT * (page - 1)}, ${
          config.PAGE_LIMIT * page
        };`,
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
    const products: ProductRes[] = await prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        currentPrice: 'desc',
      },
      take: config.TOP_LIMIT,
    })
    products.forEach(async (product) => {
      product.thumbnails = getAllThumbnailLink(product.id)
      product.detail = await getAllDetailImageLinks(product.id)
    })
    res.status(201).json(products)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const isProductOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await prisma.product.findFirst({
      where: {
        id: +(req.body.productId || req.product?.id || '/'),
        sellerId: req.user?.uuid,
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
