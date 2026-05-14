import { useState, FormEvent } from 'react'
import type { CreateRestaurantReq } from '../types/restaurant.types'
import {
  Alert,
  Button,
  Card,
  FormField,
  Grid,
  Input,
  Stack,
  Title,
} from '../../../shared/components'

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
      <Stack gap={4}>
        <Title level={3} size="sm">Nowa restauracja</Title>

        {error && <Alert>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
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

            <Grid cols={2} gap={4}>
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
            </Grid>

            <Stack direction="row" justify="end" gap={3} className="pt-1">
              <Button type="button" variant="secondary" onClick={onCancel}>Anuluj</Button>
              <Button type="submit" loading={loading}>
                {loading ? 'Tworzenie…' : 'Utwórz restaurację'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Card>
  )
}
