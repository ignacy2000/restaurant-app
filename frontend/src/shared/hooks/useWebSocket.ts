import { useEffect, useRef } from 'react'

export interface WsEvent<T = unknown> {
  type: string
  payload: T
}

export function useWebSocket(url: string, onMessage: (event: WsEvent) => void) {
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  useEffect(() => {
    const ws = new WebSocket(url)

    ws.onmessage = (e) => {
      try {
        onMessageRef.current(JSON.parse(e.data) as WsEvent)
      } catch {}
    }

    ws.onerror = () => ws.close()

    return () => ws.close()
  }, [url])
}
