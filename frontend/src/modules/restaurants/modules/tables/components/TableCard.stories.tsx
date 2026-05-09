import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { TableCard } from './TableCard'

const meta: Meta<typeof TableCard> = {
  title: 'modules/restaurants/modules/tables/components/TableCard',
  component: TableCard,
  tags: ['autodocs'],
  args: {
    restaurantId: 'rest-1',
    onUpdateCapacity: fn(),
    onDelete: fn(),
  },
}

export default meta
type Story = StoryObj<typeof TableCard>

export const Default: Story = {
  args: {
    table: { id: 'table-1', restaurant_id: 'rest-1', number: 5, capacity: 4, created_at: new Date().toISOString() },
  },
}

export const SingleSeat: Story = {
  args: {
    table: { id: 'table-2', restaurant_id: 'rest-1', number: 1, capacity: 1, created_at: new Date().toISOString() },
  },
}

export const LargeTable: Story = {
  args: {
    table: { id: 'table-3', restaurant_id: 'rest-1', number: 12, capacity: 10, created_at: new Date().toISOString() },
  },
}
