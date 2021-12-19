import { AuthData } from './auth.service'

// A wrapper for "JSON.parse()"" to support "undefined" value
function parseJSON<T>(value: string | null): T | undefined {
  try {
    return value === 'undefined' ? undefined : JSON.parse(value ?? '')
  } catch (error) {
    console.log('parsing error on', { value })
    return undefined
  }
}

function saveAuthData(data: AuthData): void {
  localStorage.setItem('auth', JSON.stringify(data))
}

function getAuthData(): AuthData | null {
  const data = localStorage.getItem('auth')
  if (!data) return null
  return parseJSON(data) as AuthData
}

function revokeAuthData(): void {
  localStorage.removeItem('auth')
}

function getRefreshToken(): string | undefined {
  const data = getAuthData()
  return data?.refreshToken
}

function updateRefreshToken(rf: string): void {
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

function updateAccessToken(rf: string): void {
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
