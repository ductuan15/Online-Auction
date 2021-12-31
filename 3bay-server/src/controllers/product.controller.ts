import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import {
  ensureProductImagePath,
  getAllDetailImageLinks,
  getAllThumbnailLink,
  removeProductDetailImageCache,
  removeProductThumbnailCache,
  saveProductDetailImage,
  saveProductThumbnail,
} from './images-product.controller.js'

import config from '../config/config.js'
import { ProductRes } from '../types/ProductRes.js'
import { PaginationRes } from '../types/PaginationRes.js'
import Prisma from '@prisma/client'

const userShortenSelection = {
  uuid: true,
  name: true,
  address: true,
  email: true,
}

export const productById = async (
  req: Request,
  res: Response,
  next: NextFunction,
  value: any,
  _: string,
) => {
  try {
    const isWithDescription = !!req.query.isWithDescription
    req.product = await prisma.product.findFirst({
      where: {
        id: +value,
        deletedAt: null,
      },
      include: {
        productDescriptionHistory: isWithDescription,
        category: true,
        seller: {
          select: userShortenSelection,
        },
        latestAuction:{
          include:{
            winningBid:{
              select:{
                bidder:{
                  select:userShortenSelection
                }
              }
            }
          }
        }
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

export const checkProductExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
  value: any,
  _: string,
) => {
  try {
    req.product = await prisma.product.findFirst({
      where: {
        id: +value,
        deletedAt: null,
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
      await saveProductThumbnail(
        files[uploadProductImagesFields.thumbnail.name],
        product.id,
      )
      await saveProductDetailImage(
        files[uploadProductImagesFields.detail.name],
        product.id,
      )
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
        productDescriptionHistory: {
          create: {
            description: data.description,
          },
        },
      },
      where: { id: +(req.product?.id || 0) },
    })
    if (req.product) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }
      if (
        data.isUpdateThumbnail &&
        files[uploadProductImagesFields.thumbnail.name].length > 0
      ) {
        await removeProductThumbnailCache(req.product.id)
        await saveProductThumbnail(
          files[uploadProductImagesFields.detail.name],
          req.product.id,
        )
      }
      if (
        data.isUpdateDetailImage &&
        files[uploadProductImagesFields.thumbnail.name].length > 0
      ) {
        await removeProductDetailImageCache(req.product.id)
        await saveProductDetailImage(
          files[uploadProductImagesFields.detail.name],
          req.product.id,
        )
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
      req.product.thumbnails = getAllThumbnailLink(req.product.id)
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
    const page = +(req.query?.page || 1)
    const limit = +(req.query?.limit || 0)
    let products: ProductRes[] = []
    if (page) {
      products = await prisma.product.findMany({
        where: {
          categoryId: categoryId,
          latestAuction: {
            // closeTime: {
            //   gt: new Date(),
            // },
          },
        },
        include: {
          latestAuction: {
            include: {
              winningBid: {
                include: {
                  bidder: {
                    select: userShortenSelection,
                  },
                },
              },
              _count: {
                select: {
                  bids: true,
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit + 1,
      })
    }
    const result: PaginationRes<ProductRes> = {
      items: products.slice(0, limit),
      hasNextPage: products.length > limit,
      cursor: 1,
    }

    products.forEach((product) => {
      product.thumbnails = getAllThumbnailLink(product.id)
    })
    res.json(result)
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
    const SORT_BY = {
      closeTime: 'closeTime',
      currentPrice: 'currentPrice',
    }
    const { key } = req.query
    const sortBy =
      req.query.sortBy === SORT_BY.closeTime
        ? SORT_BY.closeTime
        : SORT_BY.currentPrice
    const sortType: 'desc' | 'asc' =
      req.query.sortType === 'desc' ? 'desc' : 'asc'
    const page = +(req.query?.page || NaN)
    const categoryId = +(req.query?.categoryId || 0)
    const limit = +(req.query?.limit || 0)
    // get all searched ProductsId,
    const queryResultRows = await prisma.$queryRaw<any[]>(Prisma.Prisma
      .sql`SELECT products.id
  FROM products
  JOIN auctions on auctions.id = products.latestAuctionId
  ${
    key !== '' && key !== undefined
      ? Prisma.Prisma.sql`WHERE MATCH (products.name) AGAINST (${key})`
      : Prisma.Prisma.empty
  }
 
  ${
    categoryId !== 0
      ? Prisma.Prisma.sql`AND products.categoryId = ${categoryId}`
      : Prisma.Prisma.empty
  }
  ORDER BY 
  ${
    sortBy === SORT_BY.currentPrice
      ? Prisma.Prisma.sql`auctions.currentPrice ${
          sortType === 'desc' ? Prisma.Prisma.sql`desc` : Prisma.Prisma.empty
        }`
      : Prisma.Prisma.empty
  }

  ${
    sortBy === SORT_BY.closeTime
      ? Prisma.Prisma.sql`auctions.closeTime ${
          sortType === 'desc' ? Prisma.Prisma.sql`desc` : Prisma.Prisma.empty
        }`
      : Prisma.Prisma.empty
  }
   LIMIT ${limit + 1} OFFSET ${(page - 1) * limit};`)

    // get all info for products
    const productsId = queryResultRows.map((row) => row.id as number)
    productsId.slice(0, limit)

    const products: ProductRes[] = await prisma.product.findMany({
      where: {
        id: {
          in: productsId,
        },
      },
      orderBy: {
        latestAuction: {
          currentPrice: sortBy === SORT_BY.currentPrice ? sortType : undefined,
          closeTime: sortBy === SORT_BY.closeTime ? sortType : undefined,
        },
      },
      include: {
        category: true,
        seller: {
          select: userShortenSelection,
        },
        latestAuction: {
          include: {
            winningBid: {
              include: {
                bidder: {
                  select: userShortenSelection,
                },
              },
            },
            _count: {
              select: {
                bids: true,
              },
            },
          },
        },
      },
    })
    products.forEach((product) => {
      product.thumbnails = getAllThumbnailLink(product.id)
    })
    const result: PaginationRes<ProductRes> = {
      items: products.slice(0, limit),
      hasNextPage: products.length > limit,
      cursor: 1,
    }
    res.json(result)
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
        // latestAuction: {
        //   closeTime: {
        //     gte: new Date(),
        //   },
        // },
      },
      orderBy: {
        latestAuction: {
          winningBid: {
            bidPrice: 'desc',
          },
        },
      },
      include: {
        latestAuction: {
          include: {
            winningBid: {
              include: {
                bidder: {
                  select: userShortenSelection,
                },
              },
            },
            _count: {
              select: {
                bids: true,
              },
            },
          },
        },
      },
      take: config.TOP_LIMIT,
    })
    products.forEach((product) => {
      product.thumbnails = getAllThumbnailLink(product.id)
    })
    res.json(products)
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
        id: +(req.product?.id || NaN),
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

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await prisma.product.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: req.product?.id,
      },
    })
    res.json(product)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

export const uploadProductImagesFields = {
  thumbnail: {
    name: 'thumbnail',
    maxCount: 1,
  },
  detail: {
    name: 'detail',
    maxCount: 6,
  },
}
