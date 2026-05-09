import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'shared/components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Kliknij mnie' },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Danger: Story = { args: { variant: 'danger' } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
export const Loading: Story = { args: { loading: true } }
export const Disabled: Story = { args: { disabled: true } }
export const FullWidth: Story = { args: { fullWidth: true } }
