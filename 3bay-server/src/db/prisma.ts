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

// TODO add soft delete middlewares

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Duration: ' + e.duration + 'ms')
})
export default prisma
