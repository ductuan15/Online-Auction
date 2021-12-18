import axios from 'axios'
import config from '../config/config'
import TokenService from './token.service'

const axiosApiInstance = axios.create({
  baseURL: config.API_HOST_NAME,
  headers: {
    'Content-Type': 'application/json',
  },
})

// request interceptor to add the auth token header to requests
axiosApiInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.getAccessToken()

    if (token && config.headers) {
      // config.headers['x-auth-token'] = accessToken
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// response interceptor to refresh token on receiving token expired error
axiosApiInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const refreshToken = TokenService.getRefreshToken()
    const originalUrl = error.config.url
    const originalRequest = error.config

    if (
      originalUrl !== '/auth/signin' &&
      refreshToken &&
      error.response.status === 401 && // unauthorized
      error.response.status === 403 && // forbidden
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const res = await axiosApiInstance.post('/auth/rf', {
          refreshToken: refreshToken,
        })
        if (res.status === 200) {
          TokenService.updateAccessToken(res.data.token)
          // localStorage.setItem('t', res.data.accessToken)

          console.log('Access token refreshed!')
          return axios(originalRequest)
        }
      } catch (e) {
        return Promise.reject(e)
      }

      return axiosApiInstance(originalRequest)
    }

    return Promise.reject(error)
  },
)

export default axiosApiInstance
