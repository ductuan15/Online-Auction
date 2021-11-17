const config = {
  apiHostName:
    process.env.REACT_APP_API_HOST_NAME || `http://localhost:${process.env.PORT || 3030}`,
}

export default config