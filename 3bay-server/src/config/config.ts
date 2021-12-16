import dotenv from 'dotenv'

dotenv.config()

const {
  PORT,
  HOST_NAME,
  JWT,
  DATABASE_URL,
  SALT_ROUND,
  PAGE_LIMIT,
  TOP_LIMIT,

  // email service configurations
  MAIL_ENABLE_SERVICE,
  MAIL_SERVICE,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PWD,
  MAIL_CYPHER,

} = process.env

const config = {
  PORT: PORT || 3030,
  HOST_NAME: HOST_NAME || `http://localhost:${PORT || 3030}`,
  JWT: JWT || 'JWT',
  DATABASE: DATABASE_URL || '3bay',
  SALT_ROUND: +(SALT_ROUND || '10') || 10,
  PAGE_LIMIT: +(PAGE_LIMIT || '20') || 20,
  TOP_LIMIT: +(TOP_LIMIT || '5') || 5,
}

export const mailConfig = {
  IS_ENABLED: Boolean(MAIL_ENABLE_SERVICE) || false,
  SERVICE: MAIL_SERVICE || 'gmail',
  HOST: MAIL_HOST || 'smtp.gmail.com',
  PORT: +(MAIL_PORT || '465') || 465,
  USER: MAIL_USER || '',
  PWD: MAIL_PWD || '',
  CYPHERS: MAIL_CYPHER || 'SSLv3',
}

export default config
