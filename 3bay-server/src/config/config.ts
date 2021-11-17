const config = {
  port: process.env.PORT || 3030,
  hostname:
    process.env.HOST_NAME || `http://localhost:${process.env.PORT || 3030}`,
  jwtSecret: process.env.JWT_SECRET || '3BAY_JWT_SECRET_UNSEE_ME_NOW',
  database: '3bay',
}

export default config