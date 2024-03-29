import path, { dirname } from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import fs, { ensureDirSync } from 'fs-extra'
import config from '../config/config.js'
import { Request, Response } from 'express'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const MAX_IMAGE_SIZE = 2048

const ProductImageSize: {
  [key: string]: number
} = {
  sm: 240,
  md: 480,
  lg: 720,
}

const ImageURLPrefixType = {
  PATH: path.join(__dirname, '../../public/images/product'),
  LINK: `${config.HOST_NAME}/api/images/product`,
}

export const saveProductThumbnail = async (
  files: Buffer,
  productId: Number,
) => {
  if (files) {
    // crop the original image & save
    await sharp(files)
      .resize(MAX_IMAGE_SIZE, MAX_IMAGE_SIZE)
      .toFile(getThumbnailUrl.getPath(productId))

    for (const key in ProductImageSize) {
      await sharp(files)
        .resize(ProductImageSize[key])
        .toFile(getThumbnailUrl.getPath(productId, key))
    }
  }
}

export const saveProductDetailImage = async (
  files: Express.Multer.File[],
  productId: Number,
) => {
  if (files) {
    for (const file of files) {
      const index = files.indexOf(file)
      await sharp(file.buffer)
        .resize(MAX_IMAGE_SIZE, MAX_IMAGE_SIZE)
        .toFile(getDetailImageUrl.getPath(productId, index))
    }
  }
}

export const removeProductThumbnailCache = async (productId: Number) => {
  const folder = getThumbnailOutputPath(productId)
  await fs.remove(folder)
}

export const removeProductDetailImageCache = async (productId: Number) => {
  const folder = getDetailImageFolderPath(productId)
  await fs.emptyDir(folder)
}

export const getThumbnailUrl = {
  getPath: (productId: Number, imageSize?: keyof typeof ProductImageSize) => {
    if (!imageSize) {
      return path.join(
        ImageURLPrefixType.PATH,
        `${productId}`,
        `thumbnail.jpeg`,
      )
    } else {
      return path.join(
        ImageURLPrefixType.PATH,
        `${productId}`,
        'output',
        `${imageSize}.jpeg`,
      )
    }
  },
  getLink: (productId: number, imageSize?: keyof typeof ProductImageSize) => {
    if (!imageSize) {
      return `${ImageURLPrefixType.LINK}/${productId}/thumbnail`
    } else {
      return `${ImageURLPrefixType.LINK}/${productId}/output/?type=${imageSize}`
    }
  },
}
export const getDetailImageUrl = {
  getPath: (productId: Number, index: number) => {
    return path.join(
      ImageURLPrefixType.PATH,
      `${productId}`,
      'detail',
      `${index}.jpeg`,
    )
  },
  getLink: (productId: Number, index: number) => {
    return `${ImageURLPrefixType.LINK}/${productId}/detail/${index}`
  },
}

export const getThumbnailOutputPath = (productId: Number) => {
  return path.join(ImageURLPrefixType.PATH, `${productId}`, 'output')
}

export const getDetailImageFolderPath = (productId: Number) => {
  return path.join(ImageURLPrefixType.PATH, `${productId}`, 'detail')
}

export const ensureProductImagePath = async (productId: number) => {
  await fs.ensureDir(getDetailImageFolderPath(productId))
  await fs.ensureDir(getThumbnailOutputPath(productId))
}
export const getAllThumbnailLink = (productId: Number) => {
  const link = `${ImageURLPrefixType.LINK}/${productId}/`
  // console.log(link)
  return {
    sm: `${link}?type=sm`,
    md: `${link}?type=md`,
    lg: `${link}?type=lg`,
    original: `${link}`,
  }
}

export const getAllDetailImageLinks = async (productId: Number) => {
  try {
    let files = await fs.readdir(getDetailImageFolderPath(productId))
    files = files.map((file) => {
      const fileWithoutExtension = path.parse(file).name
      return `${ImageURLPrefixType.LINK}/${productId}/detail/${fileWithoutExtension}`
    })
    return files
  } catch (error) {
    return []
  }
}
export const findProductThumbnail = async (req: Request, res: Response) => {
  const thumbnailSizeType = req.query.type as keyof typeof ProductImageSize
  // console.log(thumbnailSizeType)

  const productId = +req.params.productId
  let fileOutPath
  if (productId) {
    ensureDirSync(getThumbnailOutputPath(productId))

    fileOutPath = getThumbnailUrl.getPath(productId, thumbnailSizeType)
    const defaultImage = getThumbnailUrl.getPath(productId)
    if (!fs.existsSync(fileOutPath) && fs.existsSync(defaultImage)) {
      const file = await fs.readFile(defaultImage)
      await saveProductThumbnail(file, productId)
    }
  } else {
    fileOutPath = getDefaultImage()
  }

  res.sendFile(fileOutPath)
}

export const findProductDetailImage = (req: Request, res: Response) => {
  const index = +req.params.index
  const productId = +req.params.productId
  // console.log(req.params.index, req.params.productId)

  let fileOutPath
  if (!isNaN(index) && !isNaN(productId)) {
    fileOutPath = getDetailImageUrl.getPath(productId, index)
  } else {
    fileOutPath = getDefaultImage()
  }
  res.sendFile(fileOutPath)
}

export const getDefaultImage = () => {
  return getThumbnailUrl.getPath(0)
}
