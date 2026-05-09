export interface Restaurant {
  id: string
  user_id: string
  name: string
  description: string
  address: string
  created_at: string
}

export interface CreateRestaurantReq {
  name: string
  description?: string
  address?: string
}
