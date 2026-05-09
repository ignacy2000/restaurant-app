import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from './EmptyState'
import { Button } from './Button'

const meta: Meta<typeof EmptyState> = {
  title: 'shared/components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {
    icon: '🍽️',
    title: 'Brak restauracji',
    description: 'Dodaj swoją pierwszą restaurację, aby zacząć.',
  },
}

export const WithAction: Story = {
  args: {
    icon: '🍽️',
    title: 'Brak restauracji',
    description: 'Dodaj swoją pierwszą restaurację, aby zacząć.',
    action: <Button>Dodaj restaurację</Button>,
  },
}

export const NoDescription: Story = {
  args: {
    icon: '📋',
    title: 'Brak zamówień',
  },
}
