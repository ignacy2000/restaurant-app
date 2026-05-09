import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { CreateRestaurantForm } from './CreateRestaurantForm'

const meta: Meta<typeof CreateRestaurantForm> = {
  title: 'modules/restaurants/components/CreateRestaurantForm',
  component: CreateRestaurantForm,
  tags: ['autodocs'],
  args: {
    onSubmit: fn(),
    onCancel: fn(),
  },
}

export default meta
type Story = StoryObj<typeof CreateRestaurantForm>

export const Default: Story = {}
