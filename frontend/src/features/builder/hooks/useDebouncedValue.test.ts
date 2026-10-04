import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('updates the returned value after the delay', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 600),
      { initialProps: { value: 'first' } },
    )

    rerender({ value: 'second' })
    expect(result.current).toBe('first')
    act(() => vi.advanceTimersByTime(599))
    expect(result.current).toBe('first')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('second')
  })
})
