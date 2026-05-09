import { useCallback, useEffect, useRef, useState } from 'react'
import { ordersApi } from '../services/orders.api'
import type { Order, OrderStatus } from '../types/order.types'

function isOrderActive(status: OrderStatus): boolean {
  return status !== 'delivered' && status !== 'cancelled'
}

export function useOrders(restaurantId: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    const controller = new AbortController()

    async function fetchOrders() {
      try {
        setLoading(true)
        setError(null)
        const data = await ordersApi.getActiveByRestaurant(restaurantId, controller.signal)
        if (!controller.signal.aborted) setOrders(data)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Błąd pobierania zamówień')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchOrders()
    return () => {
      mountedRef.current = false
      controller.abort()
    }
  }, [restaurantId])

  const updateStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    let previous: Order[] | null = null
    setOrders(prev => {
      previous = prev
      if (!isOrderActive(status)) return prev.filter(o => o.id !== orderId)
      return prev.map(o => o.id === orderId ? { ...o, status } : o)
    })
    try {
      await ordersApi.updateStatus(restaurantId, orderId, { status })
    } catch (err) {
      if (!mountedRef.current) return
      if (previous !== null) setOrders(previous)
      setError(err instanceof Error ? err.message : 'Błąd aktualizacji zamówienia')
    }
  }, [restaurantId])

  const upsert = useCallback((order: Order) => {
    setOrders(prev => {
      const idx = prev.findIndex(o => o.id === order.id)
      if (!isOrderActive(order.status)) {
        return idx >= 0 ? prev.filter(o => o.id !== order.id) : prev
      }
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = order
        return next
      }
      return [...prev, order]
    })
  }, [])

  return { orders, loading, error, updateStatus, upsert }
}
