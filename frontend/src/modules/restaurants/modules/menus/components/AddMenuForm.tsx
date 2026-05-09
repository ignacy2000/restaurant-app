import { useState, FormEvent } from 'react'
import type { CreateMenuReq } from '../types/menu.types'
import { Alert } from '../../../../../shared/components/Alert'
import { Button } from '../../../../../shared/components/Button'
import { Card } from '../../../../../shared/components/Card'
import { FormField } from '../../../../../shared/components/FormField'
import { Input } from '../../../../../shared/components/Input'
import { Textarea } from '../../../../../shared/components/Textarea'

interface Props {
  onSubmit: (data: CreateMenuReq) => Promise<void>
  onCancel: () => void
}

export function AddMenuForm({ onSubmit, onCancel }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit({ name, description })
      setName('')
      setDescription('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd dodawania menu')
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-base font-bold mb-4 dark:text-white">Nowe menu</h3>

      {error && <Alert className="mb-4">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Nazwa *" htmlFor="m-name">
          <Input
            id="m-name"
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="np. Karta dań, Lunch, Sezonowe"
          />
        </FormField>

        <FormField label="Opis" htmlFor="m-desc">
          <Textarea
            id="m-desc"
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Krótki opis menu (opcjonalnie)"
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onCancel}>Anuluj</Button>
          <Button type="submit" loading={loading}>
            {loading ? 'Dodawanie…' : 'Dodaj menu'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
