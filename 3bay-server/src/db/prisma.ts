import Prisma from '@prisma/client'
import DOMPurify from 'isomorphic-dompurify'

const prisma = new Prisma.PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
})

// SOFT DELETE MIDDLEWARE
// prisma.$use(async (params, next) => {
//   // Check incoming query type
//   if (params.model == 'categories') {
//     if (params.action == 'delete') {
//       // Delete queries
//       // Change action to an update
//       params.action = 'update'
//       params.args['data'] = { deletedAt: new Date().toISOString() }
//     }
//     if (params.action == 'deleteMany') {
//       // Delete many queries
//       params.action = 'updateMany'
//       if (params.args.data != undefined) {
//         params.args.data['deletedAt'] = new Date().toISOString()
//       } else {
//         params.args['data'] = { deletedAt: new Date().toISOString() }
//       }
//     }
//   }
//   return next(params)
// })

// prisma.$use(async (params, next) => {
//   // check incoming query terms`
//   if (params.model === 'users') {
//     const result = await next(params)
//     if (result) {
//       delete result['isDisabled']
//       delete result['pwd']
//       delete result['verified']
//       delete result['refreshToken']
//     }
//     return result
//   }
//   return await next(params)
// })

prisma.$use(async (params, next) => {
  if (params.model === 'ProductDescriptionHistory') {
    if (
      params.action === 'update' ||
      params.action === 'upsert' ||
      params.action === 'create'
    ) {
      if (params.args.data.description) {
        params.args.data.description = DOMPurify.sanitize(
          params.args.data.description
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
})

prisma.$on('query', (e) => {
  const color = '\u001B[38;5;33m'
  console.log(`${color}Query: ` + e.query + '\u001B[m')
  // console.log('Duration: ' + e.duration + 'ms')
})
export default prisma
