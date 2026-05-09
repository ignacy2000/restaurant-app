import { useCallback } from 'react'
import { authStorage } from '../../../shared/services/auth.storage'
import { authApi } from '../services/auth.api'

export function useAuth() {
  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password)
    authStorage.save(data.access_token, data.refresh_token, email)
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    await authApi.register(email, password)
    const data = await authApi.login(email, password)
    authStorage.save(data.access_token, data.refresh_token, email)
  }, [])

  const logout = useCallback(() => {
    authStorage.clear()
  }, [])

  return {
    isAuthenticated: authStorage.isAuthenticated(),
    email: authStorage.getUserEmail(),
    login,
    register,
    logout,
  }
}
