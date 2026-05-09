import { useCallback, useEffect, useRef, useState } from 'react'
import { restaurantsApi } from '../services/restaurants.api'
import type { Restaurant, CreateRestaurantReq } from '../types/restaurant.types'

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    const controller = new AbortController()

    async function fetchRestaurants() {
      try {
        setLoading(true)
        setError(null)
        const data = await restaurantsApi.getMyRestaurants(controller.signal)
        if (!controller.signal.aborted) setRestaurants(data)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Błąd pobierania restauracji')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchRestaurants()
    return () => {
      mountedRef.current = false
      controller.abort()
    }
  }, [])

  const create = useCallback(async (data: CreateRestaurantReq): Promise<Restaurant> => {
    const created = await restaurantsApi.createRestaurant(data)
    if (mountedRef.current) setRestaurants(prev => [...prev, created])
    return created
  }, [])

  return { restaurants, loading, error, create }
}

export function useRestaurant(id: string) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchRestaurant() {
      try {
        setLoading(true)
        setError(null)
        const data = await restaurantsApi.getRestaurant(id, controller.signal)
        if (!controller.signal.aborted) setRestaurant(data)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Błąd pobierania restauracji')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchRestaurant()
    return () => controller.abort()
  }, [id])

  return { restaurant, loading, error }
}
