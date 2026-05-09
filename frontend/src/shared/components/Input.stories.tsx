import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'shared/components/Input',
  component: Input,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = { args: { placeholder: 'Wpisz tekst…' } }
export const Email: Story = { args: { type: 'email', placeholder: 'jan@example.com' } }
export const Password: Story = { args: { type: 'password', placeholder: '••••••••' } }
export const WithValue: Story = { args: { defaultValue: 'jan@example.com', type: 'email' } }
export const Disabled: Story = { args: { disabled: true, placeholder: 'Pole niedostępne' } }
