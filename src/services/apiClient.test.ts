import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApiClient, type TokenStore } from './apiClient'

describe('api client', () => {
  afterEach(() => vi.restoreAllMocks())
  it('refreshes and retries a request after a 401', async () => {
    const store: TokenStore = { getAccessToken: () => 'expired', getRefreshToken: () => 'refresh', setTokens: vi.fn(), clear: vi.fn() }
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('', { status: 401 })).mockResolvedValueOnce(new Response('{}', { status: 200 }))
    vi.mock('./authService', async () => ({ refreshAccessToken: vi.fn().mockResolvedValue({ accessToken: 'fresh', refreshToken: 'new-refresh' }) }))
    const client = createApiClient(store)
    const response = await client('/protected')
    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(store.setTokens).toHaveBeenCalledWith('fresh', 'new-refresh')
  })
})
