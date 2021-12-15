import { AuthData } from './auth.service'

function saveAuthData(data: AuthData) {
  localStorage.setItem('auth', JSON.stringify(data))
}

function getAuthData(): AuthData | null {
  const data = localStorage.getItem('auth')
  if (!data) return null
  return JSON.parse(data) as AuthData
}

function revokeAuthData() {
  localStorage.removeItem('auth')
}

function getRefreshToken(): string | undefined {
  const data = getAuthData()
  return data?.refreshToken
}

function updateRefreshToken(rf: string) {
  const data = getAuthData()
  if (data) {
    data.refreshToken = rf
    saveAuthData(data)
  }
}

function getAccessToken(): string | undefined {
  const data = getAuthData()
  return data?.token
}

function updateAccessToken(rf: string) {
  const data = getAuthData()
  if (data) {
    data.token = rf
    saveAuthData(data)
  }
}

const TokenService = {
  saveAuthData,
  getAuthData,
  revokeAuthData,
  getRefreshToken,
  updateRefreshToken,
  getAccessToken,
  updateAccessToken,
}
export default TokenService
