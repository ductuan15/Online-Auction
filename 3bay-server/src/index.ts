import config from './config/config.js'
import app from './express.js'
import prisma from './db/prisma.js'
import c from 'ansi-colors'
import { createServer } from 'http'
import initSocketIo from './socket/socket.io.js'
import scheduler from './services/auction.service.js'

const PORT = process.env.PORT || config.PORT || 3030

async function main() {
  const server = createServer(app)
  initSocketIo(server)

  server.listen(PORT, () => {
    console.log(c.magenta(`App listening on the port`), c.bgMagenta(`${PORT}`))
    console.log(c.magenta(`hostname`), c.bgMagenta(`${config.HOST_NAME}`))
    console.log(c.magenta(`Hope you're having a great day :>`))
    console.log(c.magenta(`Happy coding!`))
  })
  await scheduler.init()
}

main()
  .catch((e) => {
    console.log(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
