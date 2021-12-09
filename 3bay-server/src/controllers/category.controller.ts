import { NextFunction, Request, Response } from 'express'
import prisma from '../db/prisma.js'
import pkg from '@prisma/client'
import config from '../config/config.js'
import {
  removeCategoryThumbnailCache,
  saveCategoryThumbnail,
} from './images.controller.js'
import { CategoryErrorException } from '../error/error-exception.js'
import { CategoryErrorCode } from '../error/error-code.js'

const Prisma = pkg.Prisma

const categoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
  value: any,
  _: string,
) => {
  try {
    if (typeof value === 'number' || typeof value === 'string') {
      req.category = await prisma.categories.findUnique({
        select: categoryDefaultSelect,
        where: {
          id: +value,
        },
      })
    }
    next()
  } catch (error: any) {
    return errorNotFound(next)
  }
}

const handlePrismaCategoryError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.log(err)
  let metaData = null
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    metaData = { prisma: err.message }
    if (err.code === 'P2002')
      return next(
        new CategoryErrorException({ code: CategoryErrorCode.NameExisted }),
      )
  }
  // console.log(c.bgMagenta(err))
  return next(
    new CategoryErrorException({
      code:
        req.method === 'POST'
          ? CategoryErrorCode.UnknownCreateError
          : CategoryErrorCode.UnknownUpdateError,
      metaData: metaData,
    }),
  )
}

interface CategoryRes {
  id: number
  title: string
  parentId: number | null
  otherCategories: Array<Partial<pkg.categories>>
}

const categoryDefaultSelect = {
  id: true,
  title: true,
  parentId: true,
  // get subcategory
  otherCategories: {
    select: {
      id: true,
      title: true,
      parentId: true,
    },
  },
}

const categoryWithThumbnailLinks = (category: Partial<CategoryRes>) => {
  const link = `${config.hostname}/api/images/category/${category.id}`

  if (category.otherCategories) {
    // get thumbnail links for sub-categories
    category.otherCategories = category.otherCategories.map((subCat) => {
      return categoryWithThumbnailLinks(subCat)
    })
  }

  return {
    ...category,
    thumbnails: {
      sm: `${link}?type=sm`,
      md: `${link}?type=md`,
      lg: `${link}?type=lg`,
      original: `${link}`,
    },
  }
}

const findAll = (req: Request, res: Response, next: NextFunction) => {
  prisma.categories
    .findMany({
      select: categoryDefaultSelect,
      where: {
        parentId: null,
      },
    })
    .then((categories) => {
      return res.json(
        categories.map((cat) => {
          return categoryWithThumbnailLinks(cat)
        }),
      )
    })
    .catch((reason) => {
      next(
        new CategoryErrorException({
          code: CategoryErrorCode.UnknownError,
          metaData: { prisma: reason },
        }),
      )
    })
}

function errorNotFound(next: NextFunction) {
  next(new CategoryErrorException({ code: CategoryErrorCode.NotFound }))
}

const read = (req: Request, res: Response, next: NextFunction) => {
  if (req.category) {
    return res.json(categoryWithThumbnailLinks(req.category))
  }
  errorNotFound(next)
}

const add = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    const data = req.body
    if (data && data.title) {
      try {
        const category = await prisma.categories.create({
          data: {
            title: data.title as string,
            parentId: JSON.parse(data.parentId) || null,
          },
        })
        if (req.file) {
          await saveCategoryThumbnail(req.file, category.id)
        }
        return res.status(201).json(categoryWithThumbnailLinks(category))
      } catch (err: any) {
        return handlePrismaCategoryError(err, req, res, next)
      }
    }
  }
  return next(
    new CategoryErrorException({ code: CategoryErrorCode.EmptyRequest }),
  )
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) {
    return next(
      new CategoryErrorException({ code: CategoryErrorCode.EmptyRequest }),
    )
  }

  if (req.category) {
    const data = req.body

    try {
      const result = await prisma.categories.update({
        data: {
          title: data.title || req.category.title,
          parentId:
            (data.parentId !== undefined && JSON.parse(data.parentId)) ||
            req.category.parentId,
        },
        where: { id: req.category.id },
      })
      if (req.file) {
        removeCategoryThumbnailCache(req.category.id)
        await saveCategoryThumbnail(req.file, req.category.id)
      }
      return res.json(categoryWithThumbnailLinks(result))
    } catch (err: any) {
      return handlePrismaCategoryError(err, req, res, next)
    }
  }
  return errorNotFound(next)
}

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.category) {
    if (req.category.parentId != null) {
      const parentCategory = await prisma.categories.findUnique({
        where: { id: req.category.parentId },
      })

      if (parentCategory) {
        await prisma.categories.updateMany({
          where: {
            parentId: req.category.id,
          },
          data: {
            parentId: parentCategory.parentId,
          },
        })
      }
    }

    try {
      const deletedCategory = await prisma.categories.delete({
        where: {
          id: req.category.id,
        },
      })
      // console.log(deleteCategory)
      return res.json(categoryWithThumbnailLinks(deletedCategory))
    } catch (e) {
      return next()
    }
  }
  return errorNotFound(next)
}

export default {
  findAll,
  categoryById,
  read,
  add,
  update,
  deleteCategory,
}
