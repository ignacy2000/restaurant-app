import type { Meta, StoryObj } from '@storybook/react'
import { Text } from './Text'

const meta: Meta<typeof Text> = {
  title: 'shared/components/Text',
  component: Text,
  tags: ['autodocs'],
  args: { children: 'Szybki brunatny lis przeskakuje nad leniwym psem.' },
}

export default meta
type Story = StoryObj<typeof Text>

export const Default: Story = {}
export const Muted: Story = { args: { tone: 'muted' } }
export const Subtle: Story = { args: { tone: 'subtle' } }
export const Primary: Story = { args: { tone: 'primary', weight: 'medium' } }
export const Danger: Story = { args: { tone: 'danger' } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg', weight: 'semibold' } }
export const Truncated: Story = {
  args: {
    truncate: true,
    children: 'Bardzo długi tekst, który powinien zostać przycięty wielokropkiem na końcu kontenera.',
  },
  decorators: [(Story) => <div style={{ width: 200 }}><Story /></div>],
}
