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
      where: { id: +(req.product?.id || '') },
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
    let products: ProductRes[] = []
    if (page) {
      products = await prisma.product.findMany({
        where: {
          categoryId: categoryId,
        },
        include: {
          auctions: {
            where: {
              closeTime: {
                gte: new Date(),
              },
            },
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
        skip: (page - 1) * config.PAGE_LIMIT,
        take: config.PAGE_LIMIT,
      })
    }
    products.forEach(async (product) => {
      product.thumbnails = getAllThumbnailLink(product.id)
    })
    res.json(products)
  } catch (error) {
    if (error instanceof Error) {
      next(error)
    }
  }
}

// //http://localhost:3030/api/product/search/?key=iphone&page=1&timeOrder=desc&priceOrder=acs&categoryId=5
// export const search = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     // https://www.prisma.io/docs/concepts/components/prisma-client/full-text-search
//     // Prisma does not support MySQL FTS?  :<<
//     const { key, timeOrder, priceOrder } = req.query
//     const page = +(req.query?.page || '/')
//     const categoryId = +(req.query?.categoryId || '')
//     console.log(categoryId)
//     let products: ProductRes[] = []
//     if (page) {
//       // TODO: Fix this query, not good :<
//       // WTF is this :<
//       // it's not that bad tbh. More readable than your `best-friend`'s code, obviously
//       const searchResult = await prisma.$queryRaw<any[]>(
//         Prisma.Prisma
//           .sql`SELECT seller.uuid as sellerId, seller.name as sellerName , products.*, auctions.*, auctions.id as auctionId, bids.*, users.uuid,  users.name as usersName, users.email, categories.*, categories.id as categoryId
//           FROM products
//                     JOIN categories on products.categoryId = categories.id
//                     JOIN auctions on auctions.productId = products.id
//                     LEFT JOIN bids on auctions.winningBidId = bids.id
//                     LEFT JOIN users on bids.bidderId = users.uuid
//                     LEFT JOIN users as seller on products.sellerId = seller.uuid
//                           WHERE MATCH (products.name) AGAINST (${key})
//                             and
//                               auctions.closeTime
//                               > CURRENT_TIMESTAMP
//                              ${
//                                categoryId !== 0
//                                  ? Prisma.Prisma
//                                      .sql`and products.categoryId = ${categoryId}`
//                                  : Prisma.Prisma.empty
//                              }
//                           Order by auctions.closeTime ${
//                             timeOrder === 'desc'
//                               ? Prisma.Prisma.sql`desc`
//                               : Prisma.Prisma.empty
//                           }, products.currentPrice ${
//           priceOrder === 'desc' ? Prisma.Prisma.sql`desc` : Prisma.Prisma.empty
//         } LIMIT ${config.PAGE_LIMIT * (page - 1)}, ${
//           config.PAGE_LIMIT * page
//         };`,
//       )
//       // products = mappingSearchProduct(searchResult)
//       products.forEach((product) => {
//         product.thumbnails = getAllThumbnailLink(product.id)
//       })
//     }
//     res..json(products)
//   } catch (error) {
//     if (error instanceof Error) {
//       next(error)
//     }
//   }
// }

export const search = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { key, timeOrder, priceOrder } = req.query
    const page = +(req.query?.page || '/')
    const categoryId = +(req.query?.categoryId || '')
    // get all searched ProductsId,
    const queryResultRows = await prisma.$queryRaw<any[]>(Prisma.Prisma
      .sql`SELECT products.id
  FROM products
  JOIN auctions on auctions.productId = products.id
  WHERE MATCH (products.name) AGAINST (${key})
  ${
    categoryId !== 0
      ? Prisma.Prisma.sql`AND products.categoryId = ${categoryId}`
      : Prisma.Prisma.empty
  }
  Order by 
    auctions.closeTime ${
      timeOrder === 'desc' ? Prisma.Prisma.sql`desc` : Prisma.Prisma.empty
    }, 
    products.currentPrice ${
      priceOrder === 'desc' ? Prisma.Prisma.sql`desc` : Prisma.Prisma.empty
    } 
  LIMIT ${config.PAGE_LIMIT * (page - 1)}, ${config.PAGE_LIMIT * page};`)

    // get all info for products
    const productsId = queryResultRows.map((row) => row.id as number)
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productsId,
        },
      },
      include: {
        category: true,
        seller: {
          select: userShortenSelection,
        },
        auctions: {
          where: {
            closeTime: {
              gt: new Date(),
            },
          },
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
    res.json(products)
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
      include: {
        auctions: {
          where: {
            closeTime: {
              gte: new Date(),
            },
          },
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
