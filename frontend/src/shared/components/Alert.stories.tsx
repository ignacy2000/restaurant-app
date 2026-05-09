import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'shared/components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: { children: 'To jest komunikat alertu.' },
}

export default meta
type Story = StoryObj<typeof Alert>

export const Error: Story = { args: { variant: 'error' } }
export const Info: Story = { args: { variant: 'info' } }
export const Success: Story = { args: { variant: 'success' } }
