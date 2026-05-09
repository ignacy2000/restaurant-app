import { http, authedHttp } from '../../../shared/services/http'
import type { Restaurant, CreateRestaurantReq } from '../types/restaurant.types'

export const restaurantsApi = {
  async getMyRestaurants(signal?: AbortSignal): Promise<Restaurant[]> {
    const data = await authedHttp<Restaurant[] | null>('/restaurants/my', { signal })
    return data ?? []
  },

  getRestaurant: (id: string, signal?: AbortSignal) =>
    http<Restaurant>(`/restaurants/${id}`, { signal }),

  createRestaurant: (data: CreateRestaurantReq) =>
    authedHttp<Restaurant>('/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
