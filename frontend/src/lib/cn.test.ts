import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('merges custom paper color conflicts', () => {
    expect(cn('bg-paper', 'bg-moss')).toBe('bg-moss')
  })

  it('keeps a custom font size alongside a text color', () => {
    expect(cn('text-label', 'text-ink')).toBe('text-label text-ink')
  })
})
