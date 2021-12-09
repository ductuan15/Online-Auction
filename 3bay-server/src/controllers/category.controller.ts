import * as express from 'express'
import prisma from '../db/prisma.js'
import pkg from '@prisma/client'
import config from '../config/config.js'
import {
  removeCategoryThumbnailCache,
  saveCategoryThumbnail,
} from './images.controller.js'

const Prisma = pkg.Prisma

const categoryById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
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
    return res.status(400).json({
      error: 'Could not retrieve category',
    })
  }
}

const handleCreateCategoryError = (err: any, res: express.Response) => {
  console.log(err)
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2002'
  ) {
    return res.status(400).json({
      error: 'Category name existed',
    })
  }
  return res.status(418).json({
    error: 'Could not create/update category',
  })
}

const errNotFound = (res: express.Response) =>
  res.status(404).json({
    error: 'Could not found category',
  })

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

const findAll = (req: express.Request, res: express.Response) => {
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
      return res.status(500).json({
        error: reason,
      })
    })
}

const read = (req: express.Request, res: express.Response) => {
  if (req.category) {
    return res.json(categoryWithThumbnailLinks(req.category))
  }
  return errNotFound(res)
}

const add = async (req: express.Request, res: express.Response) => {
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
        return handleCreateCategoryError(err, res)
      }
    }
  }
  return res.status(400).json({
    error: 'Empty request',
  })
}

const update = async (req: express.Request, res: express.Response) => {
  if (!req.body) {
    return res.status(400).json({
      error: 'Empty request',
    })
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
      return handleCreateCategoryError(err, res)
    }
  }
  return errNotFound(res)
}

const deleteCategory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
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
  return errNotFound(res)
}

export default {
  findAll,
  categoryById,
  read,
  add,
  update,
  deleteCategory,
}
