import { http, authedHttp } from '../../../../../shared/services/http'
import type { Order, CreateOrderReq, UpdateOrderStatusReq } from '../types/order.types'

export interface ConfirmOrderResponse {
  order_id: string
  restaurant_id: string
  table_id: string
}

export const ordersApi = {
  create: (restaurantId: string, tableId: string, data: CreateOrderReq) =>
    http<Order>(`/restaurants/${restaurantId}/tables/${tableId}/orders`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  async getByRestaurant(restaurantId: string): Promise<Order[]> {
    const data = await authedHttp<Order[] | null>(`/restaurants/${restaurantId}/orders`)
    return data ?? []
  },

  async getActiveByRestaurant(restaurantId: string, signal?: AbortSignal): Promise<Order[]> {
    const data = await authedHttp<Order[] | null>(`/restaurants/${restaurantId}/orders/active`, { signal })
    return data ?? []
  },

  async getByTable(restaurantId: string, tableId: string): Promise<Order[]> {
    const data = await http<Order[] | null>(`/restaurants/${restaurantId}/tables/${tableId}/orders`)
    return data ?? []
  },

  updateStatus: (restaurantId: string, orderId: string, data: UpdateOrderStatusReq) =>
    authedHttp<void>(`/restaurants/${restaurantId}/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  confirmOrder: (token: string) =>
    http<ConfirmOrderResponse>(`/orders/confirm?token=${encodeURIComponent(token)}`),
}
