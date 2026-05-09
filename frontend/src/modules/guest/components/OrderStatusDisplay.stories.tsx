import type { Meta, StoryObj } from '@storybook/react'
import { OrderStatusDisplay } from './OrderStatusDisplay'
import type { Order } from '../../restaurants/modules/orders/types/order.types'

const baseOrder: Order = {
  id: 'order-1',
  restaurant_id: 'rest-1',
  table_id: 'table-1',
  status: 'pending',
  notes: '',
  items: [
    { id: 'i1', name: 'Margherita', quantity: 1, notes: '' },
    { id: 'i2', name: 'Cola', quantity: 2, notes: '' },
  ],
  created_at: new Date().toISOString(),
}

const meta: Meta<typeof OrderStatusDisplay> = {
  title: 'modules/guest/components/OrderStatusDisplay',
  component: OrderStatusDisplay,
  tags: ['autodocs'],
  args: { order: baseOrder },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof OrderStatusDisplay>

export const Pending: Story = {}
export const Confirmed: Story = { args: { order: { ...baseOrder, status: 'confirmed' } } }
export const Preparing: Story = { args: { order: { ...baseOrder, status: 'preparing' } } }
export const Ready: Story = { args: { order: { ...baseOrder, status: 'ready' } } }
export const Delivered: Story = { args: { order: { ...baseOrder, status: 'delivered' } } }
export const AwaitingConfirmation: Story = { args: { order: { ...baseOrder, status: 'awaiting_confirmation' } } }
export const Cancelled: Story = { args: { order: { ...baseOrder, status: 'cancelled' } } }
