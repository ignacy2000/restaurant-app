import type { Meta, StoryObj } from '@storybook/react'
import { CallWaiterButton } from './CallWaiterButton'

const meta: Meta<typeof CallWaiterButton> = {
  title: 'modules/guest/components/CallWaiterButton',
  component: CallWaiterButton,
  tags: ['autodocs'],
  args: {
    restaurantId: 'rest-1',
    tableId: 'table-1',
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CallWaiterButton>

export const Idle: Story = {}
