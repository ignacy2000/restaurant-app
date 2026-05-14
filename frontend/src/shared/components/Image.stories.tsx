import type { Meta, StoryObj } from '@storybook/react'
import { Image } from './Image'

const meta: Meta<typeof Image> = {
  title: 'shared/components/Image',
  component: Image,
  tags: ['autodocs'],
  args: {
    src: 'https://picsum.photos/seed/restaurant/600/400',
    alt: 'Przykładowe zdjęcie potrawy',
    className: 'w-64',
  },
}

export default meta
type Story = StoryObj<typeof Image>

export const Default: Story = {}
export const Rounded: Story = { args: { radius: 'lg' } }
export const Avatar: Story = {
  args: {
    src: 'https://picsum.photos/seed/avatar/200/200',
    radius: 'full',
    ratio: 'square',
    className: 'w-24',
  },
}
export const Square: Story = { args: { ratio: 'square', radius: 'md' } }
