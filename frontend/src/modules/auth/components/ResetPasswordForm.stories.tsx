import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { ResetPasswordForm } from './ResetPasswordForm'

const meta: Meta<typeof ResetPasswordForm> = {
  title: 'modules/auth/components/ResetPasswordForm',
  component: ResetPasswordForm,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ResetPasswordForm>

export const WithToken: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/reset-password?token=valid-token-example']}>
        <div className="max-w-sm mx-auto pt-8">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}

export const WithoutToken: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/reset-password']}>
        <div className="max-w-sm mx-auto pt-8">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}
