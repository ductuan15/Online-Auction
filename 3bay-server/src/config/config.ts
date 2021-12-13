import dotenv from 'dotenv'

dotenv.config()

const config = {
  PORT: process.env.PORT || 3030,
  HOST_NAME:
    process.env.HOST_NAME || `http://localhost:${process.env.PORT || 3030}`,
  JWT: process.env.JWT || '',
  DATABASE: process.env.DATABASE || '3bay',
  SALT_ROUND: process.env.SALT_ROUND || 10,
  PAGE_LIMIT: 20,
}

export default config
