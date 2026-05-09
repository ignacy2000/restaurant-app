import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'shared/components/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: <div className="p-6 text-sm text-gray-700 dark:text-gray-300">Zawartość karty</div>,
  },
}

export const WithPadding: Story = {
  args: {
    className: 'p-6',
    children: (
      <div>
        <p className="font-bold text-gray-900 dark:text-white mb-1">Tytuł karty</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Opis lub treść karty.</p>
      </div>
    ),
  },
}
