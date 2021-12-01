import multer from 'multer'

export const uploadCategoryThumbnail = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, callback) {
    if (file.mimetype !== 'image/jpeg') {
      return callback(null, false)
    }
    return callback(null, true)
  },
  limits: { files: 1, fileSize: 1024 * 1024 * 15 },
})