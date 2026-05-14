import { useParams } from 'react-router-dom'
import { useRestaurant } from '../hooks/useRestaurants'
import {
  Alert,
  Box,
  Card,
  Container,
  Grid,
  Link,
  Spinner,
  Stack,
  Text,
  Title,
} from '../../../shared/components'

const modules = [
  {
    key: 'tables',
    icon: '🪑',
    label: 'Stoliki',
    description: 'Zarządzaj stolikami i pojemnością sali',
    path: (id: string) => `/restaurants/${id}/tables`,
  },
  {
    key: 'menus',
    icon: '🍽️',
    label: 'Menu',
    description: 'Karty menu, pozycje i zdjęcia dań',
    path: (id: string) => `/restaurants/${id}/menus`,
  },
  {
    key: 'panel',
    icon: '📋',
    label: 'Panel obsługi',
    description: 'Zamówienia i wezwania kelnera na żywo',
    path: (id: string) => `/restaurants/${id}/panel`,
  },
]

export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { restaurant, loading, error } = useRestaurant(id!)

  return (
    <Container maxWidth="6xl" padding="none" className="px-6 py-8 pb-12">
      <Link to="/" variant="subtle" size="sm" className="inline-block mb-6">
        ← Moje restauracje
      </Link>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : restaurant ? (
        <Box>
          <Stack gap={1} className="mb-8">
            <Title level={1} size="3xl">{restaurant.name}</Title>
            {restaurant.address && (
              <Text tone="muted">📍 {restaurant.address}</Text>
            )}
          </Stack>

          {restaurant.description && (
            <Card className="p-6 mb-6">
              <Stack gap={2}>
                <Title level={2} size="xs" tone="muted">Opis</Title>
                <Text tone="muted">{restaurant.description}</Text>
              </Stack>
            </Card>
          )}

          <Title level={2} size="xs" tone="muted" className="mb-3">Moduły</Title>
          <Grid cols={1} responsive={{ sm: 2, lg: 3 }} gap={4}>
            {modules.map(mod => (
              <Link
                key={mod.key}
                to={mod.path(id!)}
                variant="inherit"
                className="group hover:opacity-100"
              >
                <Card className="p-6 transition hover:shadow-[var(--ios-shadow-2)]">
                  <Stack gap={2}>
                    <Text as="span" size="xl">{mod.icon}</Text>
                    <Text as="span" weight="bold" className="group-hover:text-[var(--ios-blue)] transition-colors">
                      {mod.label}
                    </Text>
                    <Text as="span" size="sm" tone="muted">{mod.description}</Text>
                  </Stack>
                </Card>
              </Link>
            ))}
          </Grid>
        </Box>
      ) : null}
    </Container>
  )
}
