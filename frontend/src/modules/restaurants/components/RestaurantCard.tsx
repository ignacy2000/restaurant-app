import { Link } from 'react-router-dom'
import type { Restaurant } from '../types/restaurant.types'
import { Card } from '../../../shared/components/Card'

interface Props {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: Props) {
  return (
    <Card className="p-6 flex flex-col gap-3 transition hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600">
      <h3 className="text-base font-bold text-gray-900 dark:text-white">{restaurant.name}</h3>
      <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400 flex-1">
        {restaurant.address && <span>📍 {restaurant.address}</span>}
        {restaurant.description && (
          <span className="line-clamp-2">{restaurant.description}</span>
        )}
      </div>
      <Link
        to={`/restaurants/${restaurant.id}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition mt-1"
      >
        Otwórz →
      </Link>
    </Card>
  )
}
