export interface Table {
  id: string
  restaurant_id: string
  number: number
  capacity: number
  created_at: string
}

export interface CreateTableReq {
  number: number
  capacity: number
}

export interface UpdateTableReq {
  capacity: number
}
