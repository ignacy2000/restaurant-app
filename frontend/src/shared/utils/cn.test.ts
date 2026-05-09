import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('returns single class unchanged', () => {
    expect(cn('px-4')).toBe('px-4')
  })

  it('joins multiple classes', () => {
    expect(cn('px-4', 'py-2', 'text-sm')).toBe('px-4 py-2 text-sm')
  })

  it('ignores falsy values', () => {
    expect(cn('px-4', false, undefined, null, '', 'py-2')).toBe('px-4 py-2')
  })

  it('handles conditional object syntax', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active')
  })

  it('resolves tailwind conflicts — last class wins', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })

  it('resolves tailwind conflicts with conditionals', () => {
    const isLarge = true
    expect(cn('text-sm', isLarge && 'text-lg')).toBe('text-lg')
  })

  it('handles array inputs', () => {
    expect(cn(['px-4', 'py-2'])).toBe('px-4 py-2')
  })

  it('returns empty string when given no truthy values', () => {
    expect(cn(false, undefined, null)).toBe('')
  })
})
