import path, { dirname } from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import config from '../config/config.js'
import fs from 'fs-extra'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PRODUCT_IMAGE_PATH = path.join(__dirname, '../../public/images/product')
const PRODUCT_THUMBNAIL_OUTPUT_PATH = path.join(
  __dirname,
  '../../public/images/product/output',
)

export const saveProductThumbnail = async (
  file: Express.Multer.File,
  productId: Number,
) => {
  removeProductThumbnailCache(productId)
  // crop the original image & save
  await sharp(file.buffer)
    .resize(1024)
    .toFile(getThumbnailPath(productId) + '.jpeg')
}

export const saveProductDetailImage = async (
  files: Express.Multer.File[],
  productId: Number,
) => {
  files.forEach(async (file, index) => {
    await sharp(file.buffer)
      .resize(1024)
      .toFile(getDetailImagePath(productId, index) + '.jpeg')
  })
}

// export const getFilesDetailImageLink = (productId: Number) => {}

export const removeProductThumbnailCache = async (productId: Number) => {
  const folder = getThumbnailOutputPath(productId)
  await fs.remove(folder)
}

export const removeProductDetailImageCache = async (productId: Number) => {
  const folder = getDetailImageFolderPath(productId)
  await fs.remove(folder)
}

export const getThumbnailPath = (productId: Number) => {
  return `${PRODUCT_IMAGE_PATH}/${productId}/thumbnail`
}

//TODO: fix this
export const getDetailImagePath = (productId: Number, index: number) => {
  return `${PRODUCT_IMAGE_PATH}/${productId}/detail/${index}`
}

export const getThumbnailOutputPath = (productId: Number) => {
  return `${PRODUCT_THUMBNAIL_OUTPUT_PATH}/${productId}`
}

export const getDetailImageFolderPath = (productId: Number) => {
  return `${PRODUCT_IMAGE_PATH}/${productId}/detail`
}

export const ensureProductImagePath = async (productId: number) => {
  await fs.ensureDir(getDetailImageFolderPath(productId))
}
export const getThumbnailLinks = (productId: Number) => {
  const link = getThumbnailPath(productId)
  return {
    sm: `${link}?type=sm`,
    md: `${link}?type=md`,
    lg: `${link}?type=lg`,
    original: `${link}`,
  }
}

export const getDetailImageLinks = async (productId: Number) => {
  try {
    const files = await fs.readdir(getDetailImageFolderPath(productId))
    return files
  } catch (error) {
    return []
  }
}
