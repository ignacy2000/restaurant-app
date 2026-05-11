export interface Menu {
  id: string
  restaurant_id: string
  name: string
  description: string
  created_at: string
}

export interface CreateMenuReq {
  name: string
  description?: string
}

export interface MenuItem {
  id: string
  menu_id: string
  name: string
  description: string
  price: number
  position: number
  image_url: string
}

export interface CreateMenuItemReq {
  name: string
  description?: string
  price: number
  position?: number
  image_url?: string
}

export interface UpdateMenuItemReq {
  name: string
  description?: string
  price: number
  position?: number
  image_url?: string
}
