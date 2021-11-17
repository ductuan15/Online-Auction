import express from 'express'
import * as fs from 'fs'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const thumbnails = ['sm', 'md', 'lg', ''] as const
type Thumbnail = typeof thumbnails[number]
type ThumbnailSize = {
  width: number
  height: number
}

function isThumbnailType(type: string): type is Thumbnail {
  return thumbnails.includes(<Thumbnail>type)
}

const CATEGORY_THUMBNAIL_PATH = path.join(
  __dirname,
  '../../public/images/category',
)
const CATEGORY_THUMBNAIL_OUTPUT_PATH = path.join(
  __dirname,
  '../../public/images/category/output',
)

async function createCategoryThumbnailIfNotExist(
  fileOutName: string,
  id: string | number,
  size: number,
) {
  if (!fs.existsSync(fileOutName)) {
    // create folder name if not exist
    if (!fs.existsSync(CATEGORY_THUMBNAIL_PATH)) {
      await fs.mkdir(
        CATEGORY_THUMBNAIL_OUTPUT_PATH,
        { recursive: true },
        (err) => {
          if (err) throw err
        },
      )
    }

    // crop the original image & save
    await sharp(`${CATEGORY_THUMBNAIL_PATH}/${id}.jpeg`)
      .resize(size)
      .toFile(fileOutName)
  }
}

const findCategoryThumbnail = async (
  req: express.Request,
  res: express.Response,
) => {
  const id = !req.id ? 0 : req.id

  let type = req.query['type'] || ''

  let size = 1024
  switch (type) {
    case 'sm':
      size = 240
      break

    case 'md':
      size = 480
      break

    case 'lg':
      size = 720
  }

  try {
    const fileOutName = `${CATEGORY_THUMBNAIL_OUTPUT_PATH}/${id}${type}.jpeg`
    await createCategoryThumbnailIfNotExist(fileOutName, id, size)

    return res.sendFile(fileOutName)
  } catch (e) {
    console.log(e)
    return res.status(404).json({
      error: 'Could not found category',
    })
  }
}

const findCategoryThumbnailById = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  id: any,
  _: string,
) => {
  if (
    (typeof id === 'string' || typeof id === 'number') &&
    fs.existsSync(`${CATEGORY_THUMBNAIL_PATH}/${id}.jpeg`)
  ) {
    req.id = id
  } else {
    // fallback image
    req.id = 0
  }
  next()
}

export default {
  findCategoryThumbnail,
  findCategoryThumbnailById,
}