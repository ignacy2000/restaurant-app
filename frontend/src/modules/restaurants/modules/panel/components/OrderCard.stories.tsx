import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { OrderCard } from './OrderCard'
import type { Order } from '../../orders/types/order.types'

const baseOrder: Order = {
  id: 'order-1',
  restaurant_id: 'rest-1',
  table_id: 'table-1',
  status: 'pending',
  notes: '',
  items: [
    { id: 'i1', name: 'Margherita', quantity: 2, notes: '' },
    { id: 'i2', name: 'Cola', quantity: 1, notes: 'bez lodu' },
  ],
  created_at: new Date(Date.now() - 5 * 60_000).toISOString(),
}

const meta: Meta<typeof OrderCard> = {
  title: 'modules/restaurants/modules/panel/components/OrderCard',
  component: OrderCard,
  tags: ['autodocs'],
  args: {
    tableNumber: 5,
    onUpdateStatus: fn(),
    order: baseOrder,
  },
}

export default meta
type Story = StoryObj<typeof OrderCard>

export const Pending: Story = {}
export const Confirmed: Story = { args: { order: { ...baseOrder, status: 'confirmed' } } }
export const Preparing: Story = { args: { order: { ...baseOrder, status: 'preparing' } } }
export const Ready: Story = { args: { order: { ...baseOrder, status: 'ready' } } }
export const Delivered: Story = { args: { order: { ...baseOrder, status: 'delivered' } } }
export const Cancelled: Story = { args: { order: { ...baseOrder, status: 'cancelled' } } }

export const WithNotes: Story = {
  args: { order: { ...baseOrder, notes: 'Alergia na gluten, proszę uważać.' } },
}

export const NoTableNumber: Story = {
  args: { tableNumber: undefined },
}
