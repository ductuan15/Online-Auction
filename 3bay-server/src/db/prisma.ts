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
prisma.$use(async (params, next) => {
  // Check incoming query type
  if (params.model == 'categories') {
    if (params.action == 'delete') {
      // Delete queries
      // Change action to an update
      params.action = 'update'
      params.args['data'] = { deleted_at: new Date().toISOString() }
    }
    if (params.action == 'deleteMany') {
      // Delete many queries
      params.action = 'updateMany'
      if (params.args.data != undefined) {
        params.args.data['deleted_at'] = new Date().toISOString()
      } else {
        params.args['data'] = { deleted_at: new Date().toISOString() }
      }
    }
  }
  return next(params)
})

prisma.$on('query', (e) => {
  const color = '\u001B[38;5;33m'
  console.log(`${color}Query: ` + e.query + '\u001B[')
  // console.log('Duration: ' + e.duration + 'ms')
})
export default prisma
