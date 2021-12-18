const config = {
  API_HOST_NAME:
    process.env.REACT_APP_API_HOST_NAME ||
    `http://localhost:${process.env.PORT || 3030}`,
  RECAPTCHA_SITE_KEY: process.env.REACT_APP_RECAPTCHA_SITE_KEY || '',
}

export default config
