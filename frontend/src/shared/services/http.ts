import { authStorage } from './auth.storage'

const BASE = '/api'

export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'HttpError'
  }
}

export async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new HttpError(res.status, (body as { error?: string }).error ?? `Błąd ${res.status}`)
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T
  }
  return res.json() as Promise<T>
}

interface TokenPair {
  access_token: string
  refresh_token: string
}

let _refreshPromise: Promise<string> | null = null

function ensureRefresh(): Promise<string> {
  if (!_refreshPromise) {
    const refreshToken = authStorage.getRefreshToken()
    _refreshPromise = http<TokenPair>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(tokens => {
        authStorage.save(tokens.access_token, tokens.refresh_token, authStorage.getUserEmail() ?? '')
        _refreshPromise = null
        return tokens.access_token
      })
      .catch(err => {
        _refreshPromise = null
        throw err
      })
  }
  return _refreshPromise
}

async function fetchWithToken<T>(path: string, options: RequestInit | undefined, token: string | null): Promise<T> {
  return http<T>(path, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
}

export async function authedHttp<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    return await fetchWithToken<T>(path, options, authStorage.getAccessToken())
  } catch (err) {
    if (err instanceof HttpError && err.status === 401) {
      try {
        const newToken = await ensureRefresh()
        return await fetchWithToken<T>(path, options, newToken)
      } catch {
        authStorage.clear()
        window.location.href = '/login'
        throw err
      }
    }
    throw err
  }
}
