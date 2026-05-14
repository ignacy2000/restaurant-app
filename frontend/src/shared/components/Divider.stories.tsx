import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from './Divider'

const meta: Meta<typeof Divider> = {
  title: 'shared/components/Divider',
  component: Divider,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Divider>

export const Horizontal: Story = {
  render: () => (
    <div>
      <p>Sekcja pierwsza</p>
      <Divider />
      <p>Sekcja druga</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center">
      <span>Lewo</span>
      <Divider orientation="vertical" />
      <span>Prawo</span>
    </div>
  ),
}
