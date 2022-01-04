import Prisma from '@prisma/client'
import DOMPurify from 'isomorphic-dompurify'
import { extendAuctionTime } from '../controllers/auction.controller.js'

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
})

prisma.$use(async (param, next) => {
  if (param.model === 'Bid') {
    if (
      param.action === 'update' ||
      param.action === 'create' ||
      param.action === 'upsert'
    ) {
      const result = await next(param)
      try {
        if (result.auctionId) {
          await extendAuctionTime(result.auctionId)
        }
      } catch (e) {
        console.log(param)
        console.log(e)
      }
      return result
    } else if (param.action === 'updateMany' || param.action === 'createMany') {
      const results = await next(param)
      try {
        if (
          results &&
          results.length &&
          results.length !== 0 &&
          results[0].auctionId
        ) {
          await extendAuctionTime(results[0].auctionId)
        }
      } catch (e) {
        console.log(param)
        console.log(e)
      }
      return results
    }
    else {
      return await next(param)
    }
  } else {
    return await next(param)
  }
})

// prisma.$on('query', (e) => {
//   // const color = '\u001B[38;5;33m'
//   // console.log(`${color}Query: ` + e.query + '\u001B[m')
//   // console.log('Duration: ' + e.duration + 'ms')
// })
export default prisma
