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
import { AuctionRes } from '../types/AuctionRes.js'
import { auctionDetailsSelection } from './auction.controller.js'
import { emitProductDetails } from '../socket/product.io.js'
import moment from 'moment'

export const sellerInfoSelection = {
  uuid: true,
  name: true,
}

export const auctionInfoSelection = {
  id: true,
  startTime: true,
  closeTime: true,
  openPrice: true,
  incrementPrice: true,
  buyoutPrice: true,
  currentPrice: true,
  bidderReview: true,
  bidderComment: true,
  sellerReview: true,
  sellerComment: true,
}

export const includeProductDetailInfo = {
  category: true,
  seller: {
    select: sellerInfoSelection,
  },
  latestAuction: {
    select: {
      ...auctionInfoSelection,
      winningBid: {
        include: {
          bidder: {
            select: sellerInfoSelection,
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
}

export async function getProductByAuction(
  auction: Partial<Prisma.Auction> | null | undefined,
): Promise<ProductRes | null> {
  const product = await prisma.product.findFirst({
    where: {
      latestAuctionId: auction?.id,
      deletedAt: null,
    },
  })

  return product ? {
    ...product,
    thumbnails: getAllThumbnailLink(product.id),
  } : null
}

export async function getProductDetails(id: number, includeDescription = true) {
  const { latestAuction, ...remain } = includeProductDetailInfo
  const latestAuctionId = await prisma.product.findFirst({
    select: {
      latestAuctionId: true,
    },
    where: {
      id: id,
      deletedAt: null,
    },
    rejectOnNotFound: true,
  })

  const product = (await prisma.product.findFirst({
    where: {
      id: id,
      deletedAt: null,
    },
    include: {
      ...remain,
      latestAuction: {
        select: auctionDetailsSelection(latestAuctionId.latestAuctionId),
      },
      productDescriptionHistory: includeDescription,
    },
    rejectOnNotFound: true,
  })) as ProductRes

  product.thumbnails = getAllThumbnailLink(id)
  product.detail = await getAllDetailImageLinks(id)

  return product
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

    req.product = await getProductDetails(+value, isWithDescription)
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
    const productData = {
      name: data.name,
      sellerId: req.user?.uuid || '',
      categoryId: +data.categoryId,
      productDescriptionHistory: {
        create: {
          description: data.description,
        },
      },
    }

    const product: ProductRes = await prisma.product.create({
      data: productData,
    })

    let auction: AuctionRes

    try {
      const auctionData = {
        incrementPrice: req.body.incrementPrice,
        autoExtendAuctionTiming: req.body.autoExtendAuctionTiming === 'true',
        openPrice: +req.body.openPrice,
        productId: product.id,
        closeTime: new Date(req.body.closeTime),
        // optional
        buyoutPrice: isNaN(+req.body.buyoutPrice)
          ? undefined
          : +req.body.buyoutPrice,
        currentPrice: +req.body.openPrice,
      }

      auction = await prisma.auction.create({
        data: auctionData,
      })
    } catch (e) {
      await prisma.product.delete({
        where: {
          id: product.id,
        },
      })
      return next(e)
    }

    await ensureProductImagePath(product.id)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    if (req.files && req.files.length !== 0) {
      await saveProductThumbnail(
        files[uploadProductImagesFields.thumbnail.name][0].buffer,
        product.id,
      )
      await saveProductDetailImage(
        files[uploadProductImagesFields.detail.name],
        product.id,
      )
    }
    return res.status(201).json({ product, auction })
  } catch (error) {
    return next(error)
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
        files[uploadProductImagesFields.thumbnail.name].length > 0 &&
        files[uploadProductImagesFields.detail.name].length > 0
      ) {
        await removeProductThumbnailCache(req.product.id)
        await saveProductThumbnail(
          files[uploadProductImagesFields.detail.name][0].buffer,
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
    res.json(count)
    await emitProductDetails(req.product?.id)
    return
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
          deletedAt: null,
          OR: [
            {
              categoryId: categoryId,
            },
            {
              category: {
                categories: {
                  id: categoryId,
                },
              },
            },
          ],
          latestAuction: {
            closeTime: {
              gt: new Date(),
            },
          },
        },
        include: includeProductDetailInfo,
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
    // const queryResultRows = await prisma.$queryRaw<any[]>(Prisma.Prisma
    //   .sql`SELECT products.id
    //        FROM products
    //                 JOIN auctions on auctions.id = products.latestAuctionId
    //        WHERE products.deletedAt IS NULL
    //            ${
    //              key !== '' && key !== undefined
    //                ? Prisma.Prisma
    //                    .sql`AND MATCH (products.name) AGAINST (${key}) `
    //                : Prisma.Prisma.empty
    //            } ${
    //   categoryId !== 0
    //     ? Prisma.Prisma.sql`AND products.categoryId = ${categoryId}`
    //     : Prisma.Prisma.empty
    // }
    //        ORDER BY ${
    //          sortBy === SORT_BY.currentPrice
    //            ? Prisma.Prisma.sql`auctions.currentPrice ${
    //                sortType === 'desc'
    //                  ? Prisma.Prisma.sql`desc`
    //                  : Prisma.Prisma.empty
    //              }`
    //            : Prisma.Prisma.empty
    //        } ${
    //   sortBy === SORT_BY.closeTime
    //     ? Prisma.Prisma.sql`auctions.closeTime ${
    //         sortType === 'desc' ? Prisma.Prisma.sql`desc` : Prisma.Prisma.empty
    //       }`
    //     : Prisma.Prisma.empty
    // }
    //            LIMIT ${limit + 1}
    //        OFFSET ${(page - 1) * limit};`)

    // // get all info for products
    // const productsId = queryResultRows.map((row) => row.id as number)
    // productsId.slice(0, limit)

    // const products: ProductRes[] = await prisma.product.findMany({
    //   where: {
    //     id: {
    //       in: productsId,
    //     },
    //   },
    //   orderBy: {
    //     latestAuction: {
    //       currentPrice: sortBy === SORT_BY.currentPrice ? sortType : undefined,
    //       closeTime: sortBy === SORT_BY.closeTime ? sortType : undefined,
    //     },
    //   },
    //   include: includeProductDetailInfo,
    // })
    const products: ProductRes[] = await prisma.product.findMany({
      where: {
        name:
          key?.length == 0
            ? undefined
            : { search: `${(key + '').split(' ').join(' ')}` },
        deletedAt: null,
        // get by category and parent category
        OR:
          categoryId == 0
            ? undefined
            : [
                {
                  categoryId: categoryId,
                },
                {
                  category: {
                    categories: {
                      id: categoryId,
                    },
                  },
                },
              ],
      },
      include: includeProductDetailInfo,
      orderBy: {
        latestAuction: {
          currentPrice: sortBy === SORT_BY.currentPrice ? sortType : undefined,
          closeTime: sortBy === SORT_BY.closeTime ? sortType : undefined,
        },
      },
      skip: (page - 1) * limit,
      take: limit + 1,
    })
    products.forEach((product) => {
      product.thumbnails = getAllThumbnailLink(product.id)
    })
    // console.log(products.length)
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
        latestAuction: {
          closeTime: {
            gte: new Date(),
          },
        },
      },
      orderBy: {
        latestAuction: {
          currentPrice: 'desc',
        },
      },
      include: includeProductDetailInfo,
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
    next(error)
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
        auctions: {
          update: {
            where: {
              id: req.product?.id,
            },
            data: {
              closeTime: moment().add(-1, 's').toDate(),
            },
          },
        },
      },
      where: {
        id: req.product?.id,
      },
    })
    res.json(product)
    await emitProductDetails(product.id, false)
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

export const getPostedProductList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products: ProductRes[] = await prisma.product.findMany({
      where: {
        deletedAt: null,
        sellerId: req.user?.uuid,
      },
      include: includeProductDetailInfo,
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

export const getTopNumberBid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const topNumberBidProducts: ProductRes[] = await prisma.product.findMany({
      where: {
        deletedAt: null,
        latestAuction: {
          closeTime: {
            gt: new Date(),
          },
        },
      },
      orderBy: {
        latestAuction: {
          bids: {
            _count: Prisma.Prisma.SortOrder.desc,
          },
        },
      },
      include: includeProductDetailInfo,
      take: config.TOP_LIMIT,
    })
    topNumberBidProducts.forEach((product) => {
      product.thumbnails = getAllThumbnailLink(product.id)
    })
    res.json(topNumberBidProducts)
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}

export const getTopCloseTime = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const topNumberBidProducts: ProductRes[] = await prisma.product.findMany({
      where: {
        deletedAt: null,
        latestAuction: {
          closeTime: {
            gt: new Date(),
          },
        },
      },
      orderBy: {
        latestAuction: {
          closeTime: Prisma.Prisma.SortOrder.asc,
        },
      },
      include: includeProductDetailInfo,
      take: config.TOP_LIMIT,
    })
    topNumberBidProducts.forEach((product) => {
      product.thumbnails = getAllThumbnailLink(product.id)
    })
    // console.log(topNumberBidProducts)
    res.json(topNumberBidProducts)
  } catch (err) {
    if (err instanceof Error) {
      next(err)
    }
  }
}
