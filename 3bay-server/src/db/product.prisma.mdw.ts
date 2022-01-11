import DOMPurify from 'isomorphic-dompurify'
import Prisma from '@prisma/client'

const productMdw: Prisma.Prisma.Middleware<any> = async (params, next) => {
  if (params.model === 'ProductDescriptionHistory') {
    if (
      params.action === 'update' ||
      params.action === 'upsert' ||
      params.action === 'create'
    ) {
      if (params.args.data.description) {
        params.args.data.description = DOMPurify.sanitize(
          params.args.data.description,
        )
      }
    } else if (
      params.action === 'createMany' ||
      params.action === 'updateMany'
    ) {
      if (params.args.data) {
        params.args.data.forEach((row: Partial<{ description: string }>) => {
          if (row.description) {
            row.description = DOMPurify.sanitize(row.description)
          }
        })
      }
    }
  }
  return await next(params)
}

export default productMdw