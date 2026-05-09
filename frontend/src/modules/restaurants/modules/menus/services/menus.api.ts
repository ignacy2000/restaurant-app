import { http, authedHttp } from '../../../../../shared/services/http'
import type { Menu, CreateMenuReq, MenuItem, CreateMenuItemReq } from '../types/menu.types'

export const menusApi = {
  async getByRestaurant(restaurantId: string, signal?: AbortSignal): Promise<Menu[]> {
    const data = await http<Menu[] | null>(`/restaurants/${restaurantId}/menus`, { signal })
    return data ?? []
  },

  create: (restaurantId: string, data: CreateMenuReq) =>
    authedHttp<Menu>(`/restaurants/${restaurantId}/menus`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  async getItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    const data = await http<MenuItem[] | null>(`/restaurants/${restaurantId}/menu-items`)
    return data ?? []
  },

  createItem: (menuId: string, data: CreateMenuItemReq) =>
    authedHttp<MenuItem>(`/menus/${menuId}/items`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteItem: (itemId: string) =>
    authedHttp<void>(`/menu-items/${itemId}`, { method: 'DELETE' }),
}
