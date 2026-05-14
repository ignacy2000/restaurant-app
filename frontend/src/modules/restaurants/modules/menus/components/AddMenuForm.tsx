import { useState, FormEvent } from 'react'
import type { CreateMenuReq } from '../types/menu.types'
import { LIMITS, validateMenuFields } from '../services/validation'
import {
  Alert,
  Button,
  Card,
  FormField,
  Input,
  Stack,
  Textarea,
  Title,
} from '../../../../../shared/components'

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
    const validationError = validateMenuFields(name, description)
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setLoading(true)
    try {
      await onSubmit({ name: name.trim(), description: description.trim() })
      setName('')
      setDescription('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd dodawania menu')
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 mb-6">
      <Stack gap={4}>
        <Title level={3} size="sm">Nowe menu</Title>

        {error && <Alert>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <FormField label="Nazwa *" htmlFor="m-name">
              <Input
                id="m-name"
                type="text"
                required
                maxLength={LIMITS.nameMax}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="np. Karta dań, Lunch, Sezonowe"
              />
            </FormField>

            <FormField label="Opis" htmlFor="m-desc">
              <Textarea
                id="m-desc"
                rows={3}
                maxLength={LIMITS.descriptionMax}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Krótki opis menu (opcjonalnie)"
              />
            </FormField>

            <Stack direction="row" justify="end" gap={3} className="pt-1">
              <Button type="button" variant="secondary" onClick={onCancel}>Anuluj</Button>
              <Button type="submit" loading={loading}>
                {loading ? 'Dodawanie…' : 'Dodaj menu'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Card>
  )
}
