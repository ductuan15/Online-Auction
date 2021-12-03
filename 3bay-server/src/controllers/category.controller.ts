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
        where: {
          id: Number(value),
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

function handleCreateCategoryError(err: any, res: express.Response) {
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

function errNotFound(res: express.Response) {
  return res.status(404).json({
    error: 'Could not found category',
  })
}

interface CategoryRes {
  id: number
  title: string
  parentId: number | null
  otherCategories: Array<Partial<pkg.categories>>
}

function categoryWithThumbnailLinks(category: Partial<CategoryRes>) {
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
      select: {
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
      },
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
        return res.status(201).json(category)
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
      const count = await prisma.categories.update({
        data: {
          title: data.title || req.category.title,
          parentId: JSON.parse(data.parentId) || req.category.parentId,
        },
        where: { id: data.id },
      })
      if (req.file) {
        removeCategoryThumbnailCache(req.category.id)
        await saveCategoryThumbnail(req.file, req.category.id)
      }
      return res.json(count)
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
    try {
      const deleteCategory = await prisma.categories.delete({
        where: {
          id: req.category.id,
        },
      })
      console.log(deleteCategory)
      return res.json(deleteCategory)
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
