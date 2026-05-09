import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from './useAuth'

vi.mock('../services/auth.api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}))

vi.mock('../../../shared/services/auth.storage', () => ({
  authStorage: {
    save: vi.fn(),
    clear: vi.fn(),
    isAuthenticated: vi.fn(),
    getUserEmail: vi.fn(),
    getAccessToken: vi.fn(),
    getRefreshToken: vi.fn(),
  },
}))

import { authApi } from '../services/auth.api'
import { authStorage } from '../../../shared/services/auth.storage'

const mockAuthApi = vi.mocked(authApi)
const mockAuthStorage = vi.mocked(authStorage)

beforeEach(() => {
  vi.clearAllMocks()
  mockAuthStorage.isAuthenticated.mockReturnValue(false)
  mockAuthStorage.getUserEmail.mockReturnValue(null)
})

describe('useAuth', () => {
  describe('login', () => {
    it('calls authApi.login and saves tokens', async () => {
      mockAuthApi.login.mockResolvedValue({
        access_token: 'acc',
        refresh_token: 'ref',
      })

      const { result } = renderHook(() => useAuth())
      await act(() => result.current.login('user@test.pl', 'haslo123'))

      expect(mockAuthApi.login).toHaveBeenCalledWith('user@test.pl', 'haslo123')
      expect(mockAuthStorage.save).toHaveBeenCalledWith('acc', 'ref', 'user@test.pl')
    })

    it('propagates error when login fails', async () => {
      mockAuthApi.login.mockRejectedValue(new Error('Nieprawidłowe dane'))

      const { result } = renderHook(() => useAuth())
      await expect(
        act(() => result.current.login('user@test.pl', 'zle'))
      ).rejects.toThrow('Nieprawidłowe dane')

      expect(mockAuthStorage.save).not.toHaveBeenCalled()
    })
  })

  describe('register', () => {
    it('registers, then logs in automatically', async () => {
      mockAuthApi.register.mockResolvedValue({
        id: '123',
        email: 'new@test.pl',
        created_at: '2024-01-01T00:00:00Z',
      })
      mockAuthApi.login.mockResolvedValue({
        access_token: 'acc',
        refresh_token: 'ref',
      })

      const { result } = renderHook(() => useAuth())
      await act(() => result.current.register('new@test.pl', 'pass'))

      expect(mockAuthApi.register).toHaveBeenCalledWith('new@test.pl', 'pass')
      expect(mockAuthApi.login).toHaveBeenCalledWith('new@test.pl', 'pass')
      expect(mockAuthStorage.save).toHaveBeenCalledWith('acc', 'ref', 'new@test.pl')
    })

    it('propagates error when register fails', async () => {
      mockAuthApi.register.mockRejectedValue(new Error('Email zajęty'))

      const { result } = renderHook(() => useAuth())
      await expect(
        act(() => result.current.register('taken@test.pl', 'pass'))
      ).rejects.toThrow('Email zajęty')

      expect(mockAuthApi.login).not.toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    it('clears storage', () => {
      const { result } = renderHook(() => useAuth())
      act(() => result.current.logout())
      expect(mockAuthStorage.clear).toHaveBeenCalledOnce()
    })
  })

  describe('isAuthenticated / email', () => {
    it('reflects storage values', () => {
      mockAuthStorage.isAuthenticated.mockReturnValue(true)
      mockAuthStorage.getUserEmail.mockReturnValue('jan@test.pl')

      const { result } = renderHook(() => useAuth())
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.email).toBe('jan@test.pl')
    })

    it('returns false and null when not logged in', () => {
      const { result } = renderHook(() => useAuth())
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.email).toBeNull()
    })
  })
})
