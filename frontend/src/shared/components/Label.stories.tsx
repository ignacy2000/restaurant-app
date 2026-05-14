import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './Label'

const meta: Meta<typeof Label> = {
  title: 'shared/components/Label',
  component: Label,
  tags: ['autodocs'],
  args: { children: 'Adres email', htmlFor: 'email' },
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {}
export const Required: Story = { args: { required: true } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
