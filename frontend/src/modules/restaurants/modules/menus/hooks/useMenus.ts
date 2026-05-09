import { useCallback, useEffect, useRef, useState } from 'react'
import { menusApi } from '../services/menus.api'
import type { Menu, CreateMenuReq } from '../types/menu.types'

export function useMenus(restaurantId: string) {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    const controller = new AbortController()

    async function fetchMenus() {
      try {
        setLoading(true)
        setError(null)
        const data = await menusApi.getByRestaurant(restaurantId, controller.signal)
        if (!controller.signal.aborted) setMenus(data)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Błąd pobierania menu')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchMenus()
    return () => {
      mountedRef.current = false
      controller.abort()
    }
  }, [restaurantId])

  const create = useCallback(async (data: CreateMenuReq): Promise<Menu> => {
    const created = await menusApi.create(restaurantId, data)
    if (mountedRef.current) setMenus(prev => [...prev, created])
    return created
  }, [restaurantId])

  return { menus, loading, error, create }
}
