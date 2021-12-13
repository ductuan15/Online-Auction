import pkg from '@prisma/client'

const prisma = new pkg.PrismaClient({
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

prisma.$use(async (params, next) => {
  // check incoming query terms`
  if (params.model === 'users' || params.model === 'admins') {
    const result = await next(params)
    if (result) {
      delete result['isDisabled']
      delete result['pwd']
      delete result['verified']
      delete result['refreshToken']
    }
    return result
  }
  return next(params)
})

prisma.$on('query', (e) => {
  const color = '\u001B[38;5;33m'
  console.log(`${color}Query: ` + e.query + '\u001B[m')
  // console.log('Duration: ' + e.duration + 'ms')
})
export default prisma
