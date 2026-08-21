import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { login, refreshAccessToken, type AuthUser } from '../services/authService'

const REFRESH_TOKEN_KEY = 'sprintdesk-refresh-token'

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  isInitializing: boolean
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  initialize: () => Promise<void>
  logout: () => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(persist((set, get) => ({
  user: null,
  accessToken: null,
  isInitializing: true,
  isLoading: false,
  error: null,
  login: async (username, password) => {
    set({ isLoading: true, error: null })
    try {
      const result = await login(username, password)
      localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken)
      set({ user: result, accessToken: result.accessToken, isLoading: false })
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : 'Unable to sign in' })
      throw error
    }
  },
  initialize: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refreshToken) { set({ isInitializing: false }); return }
    try {
      const result = await refreshAccessToken(refreshToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken)
      const persistedUser = get().user
      if (!persistedUser?.firstName || !persistedUser.lastName || !persistedUser.image) {
        get().clear()
        set({ isInitializing: false })
        return
      }
      set({ user: persistedUser, accessToken: result.accessToken, isInitializing: false })
    } catch {
      get().clear()
      set({ isInitializing: false })
    }
  },
  logout: () => { get().clear() },
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    set({ accessToken })
  },
  clear: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    set({ user: null, accessToken: null, isLoading: false, error: null })
  },
}), { name: 'sprintdesk-auth', storage: createJSONStorage(() => sessionStorage), partialize: (state) => ({ user: state.user }) }))

export const authTokenStore = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (accessToken: string, refreshToken: string) => useAuthStore.getState().setTokens(accessToken, refreshToken),
  clear: () => useAuthStore.getState().clear(),
}
