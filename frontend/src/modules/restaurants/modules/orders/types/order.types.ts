export type OrderStatus =
  | 'awaiting_confirmation'
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  id: string
  name: string
  quantity: number
  notes: string
}

export interface Order {
  id: string
  restaurant_id: string
  table_id: string
  status: OrderStatus
  notes: string
  items: OrderItem[]
  created_at: string
}

export interface CreateOrderItemReq {
  name: string
  quantity: number
  notes?: string
}

export interface CreateOrderReq {
  items: CreateOrderItemReq[]
  notes?: string
  guest_email?: string
}

export interface UpdateOrderStatusReq {
  status: OrderStatus
}
