import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { RestaurantCard } from './RestaurantCard'

const meta: Meta<typeof RestaurantCard> = {
  title: 'modules/restaurants/components/RestaurantCard',
  component: RestaurantCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="max-w-sm">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof RestaurantCard>

export const WithAllFields: Story = {
  args: {
    restaurant: {
      id: 'rest-1',
      user_id: 'user-1',
      name: 'Pizzeria Roma',
      address: 'ul. Marszałkowska 1, Warszawa',
      description: 'Najlepsza pizza w mieście, wypiekana w piecu opalanym drewnem.',
      created_at: new Date().toISOString(),
    },
  },
}

export const NameOnly: Story = {
  args: {
    restaurant: {
      id: 'rest-2',
      user_id: 'user-1',
      name: 'Bar Mleczny pod Barbakanem',
      address: '',
      description: '',
      created_at: new Date().toISOString(),
    },
  },
}
