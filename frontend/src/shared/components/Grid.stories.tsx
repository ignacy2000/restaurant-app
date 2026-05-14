import type { Meta, StoryObj } from '@storybook/react'
import { Grid } from './Grid'

const Cell = ({ n }: { n: number }) => (
  <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded text-center">{n}</div>
)

const cells = Array.from({ length: 6 }, (_, i) => <Cell key={i} n={i + 1} />)

const meta: Meta<typeof Grid> = {
  title: 'shared/components/Grid',
  component: Grid,
  tags: ['autodocs'],
  args: { children: cells },
}

export default meta
type Story = StoryObj<typeof Grid>

export const Two: Story = { args: { cols: 2, gap: 4 } }
export const Three: Story = { args: { cols: 3, gap: 4 } }
export const Responsive: Story = {
  args: { cols: 1, responsive: { sm: 2, lg: 3 }, gap: 4 },
}
