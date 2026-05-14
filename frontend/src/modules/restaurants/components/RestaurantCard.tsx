import type { Restaurant } from '../types/restaurant.types'
import { Card, Link, Stack, Text, Title } from '../../../shared/components'

interface Props {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: Props) {
  return (
    <Card className="p-6 transition hover:shadow-[var(--ios-shadow-2)]">
      <Stack gap={3}>
        <Title level={3} size="sm">{restaurant.name}</Title>
        <Stack gap={1} className="flex-1">
          {restaurant.address && (
            <Text as="span" size="sm" tone="muted">📍 {restaurant.address}</Text>
          )}
          {restaurant.description && (
            <Text as="span" size="sm" tone="muted" className="line-clamp-2">
              {restaurant.description}
            </Text>
          )}
        </Stack>
        <Link to={`/restaurants/${restaurant.id}`} size="sm" className="mt-1">
          Otwórz →
        </Link>
      </Stack>
    </Card>
  )
}
