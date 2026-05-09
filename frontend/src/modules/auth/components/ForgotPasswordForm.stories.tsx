import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { ForgotPasswordForm } from './ForgotPasswordForm'

const meta: Meta<typeof ForgotPasswordForm> = {
  title: 'modules/auth/components/ForgotPasswordForm',
  component: ForgotPasswordForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="max-w-sm mx-auto pt-8">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ForgotPasswordForm>

export const Default: Story = {}
