import { useState } from 'react'
import { callsApi } from '../../restaurants/modules/calls/services/calls.api'
import { Alert, Button, Stack, Text } from '../../../shared/components'

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
      <Alert variant="success">
        <Stack direction="row" align="center" gap={3}>
          <Text as="span" size="xl">✓</Text>
          <Stack gap={0}>
            <Text as="span" weight="semibold">Kelner został wezwany</Text>
            <Text as="span" size="sm">Obsługa jest w drodze</Text>
          </Stack>
        </Stack>
      </Alert>
    )
  }

  return (
    <Stack gap={2}>
      <Button
        onClick={handleCall}
        loading={state === 'loading'}
        fullWidth
        size="lg"
        className="bg-[var(--ios-orange)] hover:bg-[var(--ios-orange)] hover:opacity-90 py-3.5"
      >
        <Text as="span" size="xl">🔔</Text>
        {state === 'loading' ? 'Wysyłanie…' : 'Wezwij kelnera'}
      </Button>
      {state === 'error' && (
        <Text size="sm" tone="danger" align="center">Błąd — spróbuj ponownie</Text>
      )}
    </Stack>
  )
}
