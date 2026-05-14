import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from './Stack'

const Item = ({ children }: { children: string }) => (
  <div className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded">{children}</div>
)

const meta: Meta<typeof Stack> = {
  title: 'shared/components/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <Item>Pierwszy</Item>
        <Item>Drugi</Item>
        <Item>Trzeci</Item>
      </>
    ),
  },
}

export default meta
type Story = StoryObj<typeof Stack>

export const Vertical: Story = { args: { direction: 'column', gap: 4 } }
export const Horizontal: Story = { args: { direction: 'row', gap: 4 } }
export const SpaceBetween: Story = {
  args: { direction: 'row', justify: 'between', fullWidth: true },
}
export const Wrapped: Story = {
  args: { direction: 'row', gap: 2, wrap: true },
}
