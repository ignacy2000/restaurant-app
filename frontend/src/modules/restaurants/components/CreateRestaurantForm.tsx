import { useState, FormEvent } from 'react'
import type { CreateRestaurantReq } from '../types/restaurant.types'
import { Alert } from '../../../shared/components/Alert'
import { Button } from '../../../shared/components/Button'
import { Card } from '../../../shared/components/Card'
import { FormField } from '../../../shared/components/FormField'
import { Input } from '../../../shared/components/Input'

interface Props {
  onSubmit: (data: CreateRestaurantReq) => Promise<void>
  onCancel: () => void
}

export function CreateRestaurantForm({ onSubmit, onCancel }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit({ name, description, address })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd tworzenia restauracji')
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-base font-bold mb-4 dark:text-white">Nowa restauracja</h3>

      {error && <Alert className="mb-4">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Nazwa *" htmlFor="r-name">
          <Input
            id="r-name"
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="np. Pizzeria Roma"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Adres" htmlFor="r-address">
            <Input
              id="r-address"
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="ul. Przykładowa 1"
            />
          </FormField>
          <FormField label="Opis" htmlFor="r-desc">
            <Input
              id="r-desc"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Krótki opis"
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onCancel}>Anuluj</Button>
          <Button type="submit" loading={loading}>
            {loading ? 'Tworzenie…' : 'Utwórz restaurację'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
