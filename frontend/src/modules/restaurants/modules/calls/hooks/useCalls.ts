import { useCallback, useEffect, useRef, useState } from 'react'
import { callsApi } from '../services/calls.api'
import type { WaiterCall, CallStatus } from '../types/call.types'

export function useCalls(restaurantId: string) {
  const [calls, setCalls] = useState<WaiterCall[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    const controller = new AbortController()

    async function fetchCalls() {
      try {
        setLoading(true)
        setError(null)
        const data = await callsApi.getActiveByRestaurant(restaurantId, controller.signal)
        if (!controller.signal.aborted) setCalls(data)
      } catch (err) {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Błąd pobierania wezwań')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchCalls()
    return () => {
      mountedRef.current = false
      controller.abort()
    }
  }, [restaurantId])

  const updateStatus = useCallback(async (callId: string, status: CallStatus) => {
    let previous: WaiterCall[] | null = null
    setCalls(prev => {
      previous = prev
      if (status === 'done') return prev.filter(c => c.id !== callId)
      return prev.map(c => c.id === callId ? { ...c, status } : c)
    })
    try {
      await callsApi.updateStatus(restaurantId, callId, { status })
    } catch (err) {
      if (!mountedRef.current) return
      if (previous !== null) setCalls(previous)
      setError(err instanceof Error ? err.message : 'Błąd aktualizacji wezwania')
    }
  }, [restaurantId])

  const upsert = useCallback((call: WaiterCall) => {
    setCalls(prev => {
      const idx = prev.findIndex(c => c.id === call.id)
      if (call.status === 'done') {
        return idx >= 0 ? prev.filter(c => c.id !== call.id) : prev
      }
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = call
        return next
      }
      return [...prev, call]
    })
  }, [])

  return { calls, loading, error, updateStatus, upsert }
}
