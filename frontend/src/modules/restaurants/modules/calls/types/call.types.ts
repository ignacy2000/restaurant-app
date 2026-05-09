export type CallStatus = 'pending' | 'acknowledged' | 'done'

export interface WaiterCall {
  id: string
  restaurant_id: string
  table_id: string
  status: CallStatus
  created_at: string
}

export interface UpdateCallStatusReq {
  status: CallStatus
}
