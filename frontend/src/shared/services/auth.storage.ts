const KEYS = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  userEmail: 'user_email',
} as const

export const authStorage = {
  save(accessToken: string, refreshToken: string, email: string) {
    localStorage.setItem(KEYS.accessToken, accessToken)
    localStorage.setItem(KEYS.refreshToken, refreshToken)
    localStorage.setItem(KEYS.userEmail, email)
  },
  clear() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k))
  },
  getAccessToken: () => localStorage.getItem(KEYS.accessToken),
  getRefreshToken: () => localStorage.getItem(KEYS.refreshToken),
  getUserEmail: () => localStorage.getItem(KEYS.userEmail),
  isAuthenticated: () => !!localStorage.getItem(KEYS.accessToken),
}
