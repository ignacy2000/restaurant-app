import type { Meta, StoryObj } from '@storybook/react'
import { FormField } from './FormField'
import { Input } from './Input'

const meta: Meta<typeof FormField> = {
  title: 'shared/components/FormField',
  component: FormField,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FormField>

export const Default: Story = {
  args: {
    label: 'Adres e-mail',
    htmlFor: 'email',
    children: <Input id="email" type="email" placeholder="jan@example.com" />,
  },
}

export const WithError: Story = {
  args: {
    label: 'Adres e-mail',
    htmlFor: 'email',
    error: 'Nieprawidłowy adres e-mail',
    children: <Input id="email" type="email" defaultValue="niepoprawny" />,
  },
}
