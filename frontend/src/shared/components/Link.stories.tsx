import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { Link } from './Link'

const meta: Meta<typeof Link> = {
  title: 'shared/components/Link',
  component: Link,
  tags: ['autodocs'],
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  args: { children: 'Otwórz menu' },
}

export default meta
type Story = StoryObj<typeof Link>

export const Internal: Story = { args: { to: '/menu' } }
export const External: Story = { args: { href: 'https://example.com', children: 'Otwórz example.com' } }
export const Subtle: Story = { args: { to: '/menu', variant: 'subtle' } }
export const Underline: Story = { args: { to: '/menu', underline: true } }
export const Large: Story = { args: { to: '/menu', size: 'lg' } }
