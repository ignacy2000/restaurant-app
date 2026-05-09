import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { MenuCard } from './MenuCard'

const meta: Meta<typeof MenuCard> = {
  title: 'modules/restaurants/modules/menus/components/MenuCard',
  component: MenuCard,
  tags: ['autodocs'],
  args: {
    onItemCreated: fn(),
    onItemDeleted: fn(),
  },
}

export default meta
type Story = StoryObj<typeof MenuCard>

const baseMenu = {
  id: 'menu-1',
  restaurant_id: 'rest-1',
  name: 'Menu główne',
  description: 'Obiad i kolacja',
  created_at: new Date().toISOString(),
}

export const Collapsed: Story = {
  args: { menu: baseMenu, items: [] },
}

export const ExpandedEmpty: Story = {
  args: { menu: baseMenu, items: [] },
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button')
    btn?.click()
  },
}

export const WithItems: Story = {
  args: {
    menu: baseMenu,
    items: [
      { id: 'i1', menu_id: 'menu-1', name: 'Margherita', description: 'Pomidor, mozzarella', price: 32.00, position: 1 },
      { id: 'i2', menu_id: 'menu-1', name: 'Carbonara', description: 'Jajko, boczek, parmezan', price: 38.50, position: 2 },
      { id: 'i3', menu_id: 'menu-1', name: 'Tiramisù', description: '', price: 18.00, position: 3 },
    ],
  },
}
