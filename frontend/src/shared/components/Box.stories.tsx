import type { Meta, StoryObj } from '@storybook/react'
import { Box } from './Box'

const meta: Meta<typeof Box> = {
  title: 'shared/components/Box',
  component: Box,
  tags: ['autodocs'],
  args: {
    children: 'Zawartość',
    className: 'p-4 bg-gray-100 dark:bg-gray-800 rounded',
  },
}

export default meta
type Story = StoryObj<typeof Box>

export const Default: Story = {}
export const Section: Story = { args: { as: 'section' } }
export const Article: Story = { args: { as: 'article' } }
