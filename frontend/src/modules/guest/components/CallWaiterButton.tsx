import { useState } from 'react'
import { callsApi } from '../../restaurants/modules/calls/services/calls.api'
import { Button } from '../../../shared/components/Button'

type State = 'idle' | 'loading' | 'done' | 'error'

interface Props {
  restaurantId: string
  tableId: string
}

export function CallWaiterButton({ restaurantId, tableId }: Props) {
  const [state, setState] = useState<State>('idle')

  async function handleCall() {
    if (state === 'loading' || state === 'done') return
    setState('loading')
    try {
      await callsApi.create(restaurantId, tableId)
      setState('done')
      setTimeout(() => setState('idle'), 30_000)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 4_000)
    }
  }

  if (state === 'done') {
    return (
      <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-5 py-4">
        <span className="text-xl">✓</span>
        <div>
          <p className="font-semibold text-green-800 dark:text-green-400">Kelner został wezwany</p>
          <p className="text-sm text-green-600 dark:text-green-500">Obsługa jest w drodze</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleCall}
        loading={state === 'loading'}
        fullWidth
        className="py-4 bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600 rounded-xl text-base font-bold shadow-sm"
      >
        <span className="text-xl">🔔</span>
        {state === 'loading' ? 'Wysyłanie…' : 'Wezwij kelnera'}
      </Button>
      {state === 'error' && (
        <p className="text-sm text-red-600 dark:text-red-400 text-center">Błąd — spróbuj ponownie</p>
      )}
    </div>
  )
}
