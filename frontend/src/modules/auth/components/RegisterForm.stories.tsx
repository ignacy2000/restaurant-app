import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { RegisterForm } from './RegisterForm'

const meta: Meta<typeof RegisterForm> = {
  title: 'modules/auth/components/RegisterForm',
  component: RegisterForm,
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
type Story = StoryObj<typeof RegisterForm>

export const Default: Story = {}
