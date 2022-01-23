import { emitEventToSocketClients } from './socket.io.js'
import { SocketEvent } from './socket-event.js'
import c from 'ansi-colors'
import SocketMap from './socket-map.js'
import { ProductRes } from '../types/ProductRes.js'
import { getProductDetails } from '../controllers/product.controller.js'

async function getProductAndEmit(
  productId: number | undefined,
  emitCb: (productId: number, product: ProductRes | undefined) => void,
  productExist = true,
) {
  if (!productId) {
    return
  }
  try {
    console.log(c.blue(`[Socket] Emitting product details ${productId}`))

    const product = productExist
      ? await getProductDetails(productId, true)
      : undefined

    await emitCb(productId, product)
  } catch (e) {
    console.log(c.red(`[Socket] Cannot emit product details ${productId}`))
    console.log(e)
  }
}

export async function emitProductDetails(
  productId: number | undefined,
  productExist = true,
) {
  await getProductAndEmit(
    productId,
    (productId, product) => {
      emitEventToSocketClients(
        productSocketMap.getSocketClients(productId),
        SocketEvent.PRODUCT_UPDATE,
        product,
      )
      if (!productExist) {
        productSocketMap.removeEntity(productId)
      }
    },
    productExist,
  )
}

export const productSocketMap = new SocketMap()
