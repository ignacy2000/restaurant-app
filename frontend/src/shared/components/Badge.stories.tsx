import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'shared/components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Etykieta' },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Yellow: Story = { args: { color: 'yellow' } }
export const Blue: Story = { args: { color: 'blue' } }
export const Indigo: Story = { args: { color: 'indigo' } }
export const Green: Story = { args: { color: 'green' } }
export const Gray: Story = { args: { color: 'gray' } }
export const Red: Story = { args: { color: 'red' } }
