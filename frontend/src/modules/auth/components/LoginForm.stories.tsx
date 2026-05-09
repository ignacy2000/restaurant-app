import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'

const meta: Meta<typeof LoginForm> = {
  title: 'modules/auth/components/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof LoginForm>

export const Default: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/login']}>
        <div className="max-w-sm mx-auto pt-8">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}

export const WithSuccessMessage: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={[{ pathname: '/login', state: { successMessage: 'Pomyslnie zalogowano' } }]}>
        <div className="max-w-sm mx-auto pt-8">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}
