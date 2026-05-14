import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './Container'

const meta: Meta<typeof Container> = {
  title: 'shared/components/Container',
  component: Container,
  tags: ['autodocs'],
  args: {
    children: (
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded">
        Treść strony
      </div>
    ),
  },
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Container>

export const Default: Story = {}
export const Narrow: Story = { args: { maxWidth: '2xl' } }
export const Wide: Story = { args: { maxWidth: '7xl' } }
export const NoPadding: Story = { args: { padding: 'none' } }
