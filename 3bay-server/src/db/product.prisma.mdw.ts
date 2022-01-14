import DOMPurify from 'isomorphic-dompurify'
import Prisma from '@prisma/client'

const productMdw: Prisma.Prisma.Middleware = async (params, next) => {
  if (params.model === 'ProductDescriptionHistory') {
    switch (params.action) {
      case 'update':
      case 'create':
      case 'upsert': {
        if (params.args.data.description) {
          params.args.data.description = DOMPurify.sanitize(
            params.args.data.description,
          )
        }
        break
      }
      case 'updateMany':
      case 'createMany': {
        if (params.args.data) {
          params.args.data.forEach((row: Partial<{ description: string }>) => {
            if (row.description) {
              row.description = DOMPurify.sanitize(row.description)
            }
          })
        }
        break
      }
    }
  }
  return await next(params)
}

export default productMdw
