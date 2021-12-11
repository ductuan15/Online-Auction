import multer from 'multer'

export const uploadProductImages = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, callback) {
    if (file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
      return callback(null, false)
    }
    console.log(file)
    return callback(null, true)
  },
  limits: { files: 7, fileSize: 1024 * 1024 * 15 },
})
