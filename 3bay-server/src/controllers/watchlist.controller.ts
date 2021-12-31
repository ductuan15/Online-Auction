import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import {getAllThumbnailLink} from "./images-product.controller.js";
import {ProductRes} from "../types/ProductRes.js";

const userShortenSelection = {
  uuid: true,
  name: true,
  address: true,
  email: true,
}

export const getWatchListByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products:ProductRes[] = await  prisma.product.findMany({
      where:{
        userWatchlist:{
          some:{
            userId:{
              equals:req.user?.uuid
            }
          }
        }
      },
      include:{
        // seller:{
        //   select:userShortenSelection,
        // },
        // category:true,
        latestAuction:{
          include:{
            winningBid:{
              include:{
                bidder:{
                  select: userShortenSelection
                }
              }
            },
            _count:{
              select:{
                bids:true
              }
            }
          }
        }
      }
    })
    products.forEach(product => {product.thumbnails = getAllThumbnailLink((product.id))})
    return res.json(products)
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
