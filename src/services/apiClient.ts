import { refreshAccessToken } from './authService'

export type TokenStore = {
  getAccessToken: () => string | null
  getRefreshToken: () => string | null
  setTokens: (accessToken: string, refreshToken: string) => void
  clear: () => void
}

let refreshPromise: Promise<string> | null = null

export function createApiClient(tokenStore: TokenStore) {
  async function refresh(): Promise<string> {
    if (!refreshPromise) {
      const refreshToken = tokenStore.getRefreshToken()
      if (!refreshToken) throw new Error('Missing refresh token')
      refreshPromise = refreshAccessToken(refreshToken).then((result) => {
        tokenStore.setTokens(result.accessToken, result.refreshToken)
        return result.accessToken
      }).finally(() => { refreshPromise = null })
    }
    return refreshPromise
  }

  return async function request(input: RequestInfo | URL, init: RequestInit = {}, retry = true): Promise<Response> {
    const headers = new Headers(init.headers)
    const accessToken = tokenStore.getAccessToken()
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

    const response = await fetch(input, { ...init, headers })
    if (response.status !== 401 || !retry) return response

    try {
      const nextToken = await refresh()
      const retryHeaders = new Headers(init.headers)
      retryHeaders.set('Authorization', `Bearer ${nextToken}`)
      return fetch(input, { ...init, headers: retryHeaders })
    } catch (error) {
      tokenStore.clear()
      throw error
    }
  }
}
