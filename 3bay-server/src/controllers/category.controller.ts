import * as express from 'express'
import prisma from '../db/prisma.js'
import pkg from '@prisma/client'
import config from '../config/config.js'
import { saveCategoryThumbnail } from './images.controller.js'

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
      req.category = await prisma.categories.findFirst({
        where: {
          AND: [{ id: Number(value) }, { deleted_at: null }],
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
      error: 'category name existed',
    })
  }
  return res.status(418).json({
    error: 'could not create/update category',
  })
}

function errNotFound(res: express.Response) {
  return res.status(404).json({
    error: 'Could not found category',
  })
}

interface CategoryRes {
  id: number,
  title: string,
  parent_id: number | null,
  other_categories: { id: number, title: string, parent_id: number | null }[]
}

function isCategoryRes(category: pkg.categories | CategoryRes): category is CategoryRes {
  return (<CategoryRes>category).other_categories !== undefined
}

function categoryWithThumbnailLinks(
  category: CategoryRes,
) {
  const link = `${config.hostname}/api/images/category/${category.id}`

  if (isCategoryRes(category)) {
    // get thumbnail links for sub-categories
    category.other_categories = category.other_categories.map((subCat) => {
      return categoryWithThumbnailLinks(subCat as CategoryRes)
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
        parent_id: true,
        // get subcategory
        other_categories: {
          select: {
            id: true,
            title: true,
            parent_id: true,
          },
        },
      },
      where: {
        parent_id: null,
        deleted_at: null,
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
            parent_id: JSON.parse(data.parent_id) || null,
          },
        })
        if (req.file) {
          await saveCategoryThumbnail(req.file, category)
        }
        return res.status(201).json(category)
      } catch (err: any) {
        return handleCreateCategoryError(err, res)
      }
    }
  }
  return res.status(400).json({
    error: 'empty request',
  })
}

const update = async (req: express.Request, res: express.Response) => {
  if (!req.body) {
    return res.status(400).json({
      error: 'empty request',
    })
  }

  if (req.category) {
    const data = req.body

    try {
      const count = await prisma.categories.updateMany({
        data: {
          title: data.title || req.category,
          parent_id: data.parent_id || data.parentId || req.category.parent_id,
        },
        where: {
          // ignore soft delete fields
          AND: [{ id: req.category.id }, { deleted_at: null }],
        },
      })
      return res.json(count)
    } catch (err: any) {
      return handleCreateCategoryError(err, res)
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
}
