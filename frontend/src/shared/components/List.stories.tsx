import type { Meta, StoryObj } from '@storybook/react'
import { List, ListItem } from './List'

const meta: Meta<typeof List> = {
  title: 'shared/components/List',
  component: List,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <ListItem>Przystawki</ListItem>
        <ListItem>Dania główne</ListItem>
        <ListItem>Desery</ListItem>
      </>
    ),
  },
}

export default meta
type Story = StoryObj<typeof List>

export const Unordered: Story = { args: { variant: 'unordered' } }
export const Ordered: Story = { args: { variant: 'ordered' } }
export const None: Story = { args: { variant: 'none' } }
export const Tight: Story = { args: { spacing: 'sm' } }
