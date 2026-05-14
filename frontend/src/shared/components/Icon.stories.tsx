import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from './Icon'

const CheckPath = <path d="M20 6 9 17l-5-5" />
const XPath = <path d="M18 6 6 18M6 6l12 12" />

const meta: Meta<typeof Icon> = {
  title: 'shared/components/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: { children: CheckPath, label: 'Zatwierdź' },
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {}
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
export const Success: Story = { args: { tone: 'success' } }
export const Danger: Story = { args: { tone: 'danger', children: XPath, label: 'Anuluj' } }
