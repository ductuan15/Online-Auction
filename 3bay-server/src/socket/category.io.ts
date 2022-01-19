import prisma from '../db/prisma.js'
import { categoryDefaultSelect, categoryWithThumbnailLinks } from '../controllers/category.controller.js'
import { emitEvent } from './socket.io.js'
import { SocketEvent } from './socket-event.js'

async function emitCategory() {
  const categories = await prisma.category.findMany({
    select: categoryDefaultSelect,
    where: {
      parentId: null,
    },
  })

  emitEvent(SocketEvent.CATEGORY_UPDATE, categories.map((cat) => {
    return categoryWithThumbnailLinks(cat)
  }))
}

export default emitCategory
