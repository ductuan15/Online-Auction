import dotenv from 'dotenv'

dotenv.config()

const config = {
  port: process.env.PORT || 3030,
  hostname:
    process.env.HOST_NAME || `http://localhost:${process.env.PORT || 3030}`,
  jwtSecret: process.env.JWT_SECRET || '',
  database: process.env.DATABASE || '3bay',
  PAGE_LIMIT: 20
}

export default config