import type { Meta, StoryObj } from '@storybook/react'
import { Flex } from './Flex'

const Item = ({ children }: { children: string }) => (
  <div className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded">{children}</div>
)

const meta: Meta<typeof Flex> = {
  title: 'shared/components/Flex',
  component: Flex,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <Item>Logo</Item>
        <Item>Menu</Item>
        <Item>Profil</Item>
      </>
    ),
  },
}

export default meta
type Story = StoryObj<typeof Flex>

export const Default: Story = { args: { gap: 4, align: 'center' } }
export const Centered: Story = { args: { justify: 'center', align: 'center', gap: 4 } }
export const Between: Story = { args: { justify: 'between', align: 'center', fullWidth: true } }
