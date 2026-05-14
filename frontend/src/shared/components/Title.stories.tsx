import type { Meta, StoryObj } from '@storybook/react'
import { Title } from './Title'

const meta: Meta<typeof Title> = {
  title: 'shared/components/Title',
  component: Title,
  tags: ['autodocs'],
  args: { children: 'Tytuł sekcji' },
}

export default meta
type Story = StoryObj<typeof Title>

export const H1: Story = { args: { level: 1 } }
export const H2: Story = { args: { level: 2 } }
export const H3: Story = { args: { level: 3 } }
export const H4: Story = { args: { level: 4 } }
export const Primary: Story = { args: { level: 2, tone: 'primary' } }
export const Centered: Story = { args: { level: 2, align: 'center' } }
export const Levels: Story = {
  render: () => (
    <div className="space-y-2">
      <Title level={1}>Nagłówek H1</Title>
      <Title level={2}>Nagłówek H2</Title>
      <Title level={3}>Nagłówek H3</Title>
      <Title level={4}>Nagłówek H4</Title>
      <Title level={5}>Nagłówek H5</Title>
      <Title level={6}>Nagłówek H6</Title>
    </div>
  ),
}
