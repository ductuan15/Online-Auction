import config from './config/config.js'
import app from './express.js'
import prisma from './db/prisma.js'

const PORT = process.env.PORT || config.port || 3030

async function main() {
  app.listen(PORT, () => {
    const color = '\u001B[38;5;98m'
    console.log(`${color}App listening on the port ${PORT}`)
    console.log(`Hope you're having a great day :>`)
    console.log(`Happy coding!\u001B[m`)
  })
}

main()
  .catch((e) => {
    console.log(e)
  })
  .finally(await prisma.$disconnect())
