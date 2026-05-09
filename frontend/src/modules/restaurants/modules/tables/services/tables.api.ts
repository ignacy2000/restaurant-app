import { http, authedHttp } from '../../../../../shared/services/http'
import type { Table, CreateTableReq, UpdateTableReq } from '../types/table.types'

export const tablesApi = {
  async getByRestaurant(restaurantId: string, signal?: AbortSignal): Promise<Table[]> {
    const data = await http<Table[] | null>(`/restaurants/${restaurantId}/tables`, { signal })
    return data ?? []
  },

  create: (restaurantId: string, data: CreateTableReq) =>
    authedHttp<Table>(`/restaurants/${restaurantId}/tables`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCapacity: (restaurantId: string, tableId: string, data: UpdateTableReq) =>
    authedHttp<Table>(`/restaurants/${restaurantId}/tables/${tableId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (restaurantId: string, tableId: string) =>
    authedHttp<void>(`/restaurants/${restaurantId}/tables/${tableId}`, {
      method: 'DELETE',
    }),
}
