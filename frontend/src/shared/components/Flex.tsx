import { Stack } from './Stack'
import type { ComponentProps } from 'react'

type StackProps = ComponentProps<typeof Stack>

interface FlexProps extends Omit<StackProps, 'direction'> {
  direction?: StackProps['direction']
}

export function Flex({ direction = 'row', ...props }: FlexProps) {
  return <Stack direction={direction} {...props} />
}
