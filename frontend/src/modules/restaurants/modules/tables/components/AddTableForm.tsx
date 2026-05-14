import { useState, FormEvent } from 'react'
import type { CreateTableReq } from '../types/table.types'
import { validateCreateTable, TABLE_LIMITS } from '../services/validation'
import {
  Alert,
  Button,
  Card,
  FormField,
  Grid,
  Input,
  Stack,
  Title,
} from '../../../../../shared/components'

interface Props {
  onSubmit: (data: CreateTableReq) => Promise<void>
  onCancel: () => void
}

export function AddTableForm({ onSubmit, onCancel }: Props) {
  const [number, setNumber] = useState('')
  const [capacity, setCapacity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const data = { number: Number(number), capacity: Number(capacity) }
    const validationError = validateCreateTable(data)
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setLoading(true)
    try {
      await onSubmit(data)
      setNumber('')
      setCapacity('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd dodawania stolika')
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 mb-6">
      <Stack gap={4}>
        <Title level={3} size="sm">Nowy stolik</Title>

        {error && <Alert>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Grid cols={2} gap={4}>
              <FormField label="Numer stolika *" htmlFor="t-number">
                <Input
                  id="t-number"
                  type="number"
                  min={TABLE_LIMITS.numberMin}
                  max={TABLE_LIMITS.numberMax}
                  required
                  value={number}
                  onChange={e => setNumber(e.target.value)}
                  placeholder="np. 1"
                />
              </FormField>
              <FormField label="Pojemność *" htmlFor="t-capacity">
                <Input
                  id="t-capacity"
                  type="number"
                  min={TABLE_LIMITS.capacityMin}
                  max={TABLE_LIMITS.capacityMax}
                  required
                  value={capacity}
                  onChange={e => setCapacity(e.target.value)}
                  placeholder="np. 4"
                />
              </FormField>
            </Grid>

            <Stack direction="row" justify="end" gap={3}>
              <Button type="button" variant="secondary" onClick={onCancel}>Anuluj</Button>
              <Button type="submit" loading={loading}>
                {loading ? 'Dodawanie…' : 'Dodaj stolik'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Card>
  )
}
