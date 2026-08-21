export type AuthUser = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  image: string
}

export type AuthResponse = AuthUser & {
  accessToken: string
  refreshToken: string
}

const AUTH_URL = import.meta.env.VITE_AUTH_API_URL ?? '/api/dummyjson/auth'

export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 30 }),
  })

  if (!response.ok) throw new Error(response.status === 401 ? 'Invalid username or password' : 'Authentication service is unavailable')
  return response.json() as Promise<AuthResponse>
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_URL}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
  })

  if (!response.ok) throw new Error('Your session has expired')
  return response.json() as Promise<AuthResponse>
}
