import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import passport from './auth/passport.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

// routers
import categoryRoute from './routes/category.routes.js'
import imagesRoute from './routes/images.routes.js'
import imagesProductRoute from './routes/image-product.routes.js'
import productRoute from './routes/product.routes.js'
import auctionRoute from './routes/auctions.routes.js'
import bidRoute from './routes/bid.routes.js'
import authRoute from './routes/auth.routes.js'
import userRoute from './routes/user.routes.js'
import adminRoute from './routes/admin.route.js'
import watchlistRoute from './routes/watchlist.route.js'

import { errorHandler } from './error/error-handler.js'
import { ProductRes } from './types/ProductRes.js'
import { prismaErrorHandler } from './error/error-prisma.js'
import { AuctionRes } from './types/AuctionRes.js'
import Prisma from '@prisma/client'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

declare global {
  namespace Express {
    interface Request {
      category?: any | null
      product?: ProductRes | null
      auction?: AuctionRes | null
      bid?: Prisma.Bid | null
      id?: string | number | null
    }
    interface User extends Prisma.User {}
  }
}

const app = express()

function initializeMiddlewares() {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
  // parse body params and attache them to req.body
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(compress())
  // secure apps by setting various HTTP headers
  app.use(helmet())
  // enable CORS - Cross Origin Resource Sharing
  app.use(cors())
  // passportを初期化
  app.use(passport.initialize())
}

function mountRoutes() {
  app.use('/', express.static(path.join(__dirname, '../public')))
  app.use('/api/product', productRoute)
  app.use('/api/images/product', imagesProductRoute)
  app.use('/api/auction', auctionRoute)
  app.use('/api/bid', bidRoute)
  app.use('/api/category', categoryRoute)
  app.use('/api/images', imagesRoute)
  app.use('/api/user', userRoute)
  app.use('/api/auth', authRoute)
  app.use('/api/admin', adminRoute)
  app.use('/api/watchlist', watchlistRoute)
}

function initializeErrorHandler() {
  app.use(prismaErrorHandler)
  app.use(errorHandler)
}

initializeMiddlewares()
mountRoutes()
initializeErrorHandler()

export default app
