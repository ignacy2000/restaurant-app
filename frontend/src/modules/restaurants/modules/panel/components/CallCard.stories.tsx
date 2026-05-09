import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { CallCard } from './CallCard'
import type { WaiterCall } from '../../calls/types/call.types'

const baseCall: WaiterCall = {
  id: 'call-1',
  restaurant_id: 'rest-1',
  table_id: 'table-1',
  status: 'pending',
  created_at: new Date(Date.now() - 2 * 60_000).toISOString(),
}

const meta: Meta<typeof CallCard> = {
  title: 'modules/restaurants/modules/panel/components/CallCard',
  component: CallCard,
  tags: ['autodocs'],
  args: {
    tableNumber: 3,
    onUpdateStatus: fn(),
    call: baseCall,
  },
}

export default meta
type Story = StoryObj<typeof CallCard>

export const Pending: Story = {}
export const Acknowledged: Story = { args: { call: { ...baseCall, status: 'acknowledged' } } }
export const Done: Story = { args: { call: { ...baseCall, status: 'done' } } }
