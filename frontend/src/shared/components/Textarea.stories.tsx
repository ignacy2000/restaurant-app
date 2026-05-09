import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'shared/components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = { args: { placeholder: 'Dodaj uwagi…', rows: 3 } }
export const WithValue: Story = { args: { defaultValue: 'Bez glutenu, proszę.', rows: 3 } }
export const Disabled: Story = { args: { disabled: true, placeholder: 'Pole niedostępne', rows: 3 } }
