import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRestaurants } from '../hooks/useRestaurants'
import { RestaurantCard } from '../components/RestaurantCard'
import { CreateRestaurantForm } from '../components/CreateRestaurantForm'
import {
  Alert,
  Box,
  Button,
  Container,
  EmptyState,
  Grid,
  Spinner,
  Stack,
  Title,
} from '../../../shared/components'
import type { CreateRestaurantReq } from '../types/restaurant.types'

export function DashboardPage() {
  const navigate = useNavigate()
  const { restaurants, loading, error, create } = useRestaurants()
  const [showForm, setShowForm] = useState(false)

  async function handleCreate(data: CreateRestaurantReq) {
    const created = await create(data)
    setShowForm(false)
    navigate(`/restaurants/${created.id}`)
  }

  return (
    <Container maxWidth="6xl" padding="none" className="px-6 py-8 pb-12">
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : (
        <Box>
          <Stack direction="row" align="center" justify="between" className="mb-5">
            <Title level={2} size="lg">Moje restauracje</Title>
            {restaurants.length > 0 && !showForm && (
              <Button onClick={() => setShowForm(true)}>+ Dodaj nową</Button>
            )}
          </Stack>

          {showForm && (
            <CreateRestaurantForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          )}

          {restaurants.length === 0 && !showForm ? (
            <EmptyState
              icon="🍽️"
              title="Nie masz jeszcze żadnej restauracji"
              description="Dodaj swoją pierwszą restaurację, aby zacząć zarządzać menu, stolikami i zamówieniami."
              action={<Button size="lg" onClick={() => setShowForm(true)}>+ Utwórz pierwszą restaurację</Button>}
            />
          ) : (
            <Grid cols={1} responsive={{ sm: 2, lg: 3 }} gap={4}>
              {restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
            </Grid>
          )}
        </Box>
      )}
    </Container>
  )
}
