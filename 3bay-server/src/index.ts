import config from './config/config.js'
import app from './express.js'
import prisma from './db/prisma.js'
import c from 'ansi-colors'

const PORT = process.env.PORT || config.PORT || 3030

async function main() {
  app.listen(PORT, () => {
    console.log(c.magenta(`App listening on the port`), c.bgMagenta(`${PORT}`))
    console.log(c.magenta(`hostname`), c.bgMagenta(`${config.HOST_NAME}`))
    console.log(c.magenta(`Hope you're having a great day :>`))
    console.log(c.magenta(`Happy coding!`))
  })
}

main()
  .catch((e) => {
    console.log(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
