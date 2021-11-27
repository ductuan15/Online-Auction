import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

// routers
import categoryRoute from './routes/category.routes.js'
import imagesRoute from './routes/images.routes.js'
import { errorHandler } from './error/error-handler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

declare global {
  namespace Express {
    interface Request {
      category?: any | null
      id?: string | number | null
    }
  }
}

const app = express()

function initializeMiddlewares() {
  app.use(morgan('dev'))
  // parse body params and attache them to req.body
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(compress())
  // secure apps by setting various HTTP headers
  app.use(helmet())
  // enable CORS - Cross Origin Resource Sharing
  app.use(cors())
  // handle errors
  app.use(errorHandler)
}

function mountRoutes() {
  app.use('/', express.static(path.join(__dirname, '../public')))
  app.use('/', categoryRoute)
  app.use('/', imagesRoute)
}

initializeMiddlewares()
mountRoutes()

export default app
