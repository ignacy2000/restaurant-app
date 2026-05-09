import { useState, FormEvent } from 'react'
import type { CreateTableReq } from '../types/table.types'
import { Alert } from '../../../../../shared/components/Alert'
import { Button } from '../../../../../shared/components/Button'
import { Card } from '../../../../../shared/components/Card'
import { FormField } from '../../../../../shared/components/FormField'
import { Input } from '../../../../../shared/components/Input'

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
    setError('')
    setLoading(true)
    try {
      await onSubmit({ number: Number(number), capacity: Number(capacity) })
      setNumber('')
      setCapacity('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd dodawania stolika')
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-base font-bold mb-4 dark:text-white">Nowy stolik</h3>

      {error && <Alert className="mb-4">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Numer stolika *" htmlFor="t-number">
            <Input
              id="t-number"
              type="number"
              min={1}
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
              min={1}
              required
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              placeholder="np. 4"
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>Anuluj</Button>
          <Button type="submit" loading={loading}>
            {loading ? 'Dodawanie…' : 'Dodaj stolik'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
