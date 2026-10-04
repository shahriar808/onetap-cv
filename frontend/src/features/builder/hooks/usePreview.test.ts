import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchPreview } from '../../../lib/api'
import { defaultResume } from '../../../lib/defaults'
import type { ResumeData } from '../../../types/resume'
import { usePreview } from './usePreview'

vi.mock('../../../lib/api', () => ({
  fetchPreview: vi.fn(),
}))

describe('usePreview', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(fetchPreview).mockReset()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('fills only preview-required contact fields with placeholders', async () => {
    vi.mocked(fetchPreview).mockResolvedValue('<p>preview</p>')
    const data = defaultResume()
    const { result } = renderHook(() => usePreview(data, 'modern'))

    await act(async () => {
      await Promise.resolve()
    })

    expect(vi.mocked(fetchPreview).mock.calls[0][0].contact).toMatchObject({
      full_name: 'Your Name',
      email: 'you@example.com',
      phone: '+000 000 000',
    })
    expect(data.contact).toMatchObject({
      full_name: '',
      email: '',
      phone: '',
    })
    expect(result.current.html).toBe('<p>preview</p>')
  })

  it('aborts the previous request when debounced data changes', async () => {
    const signals: AbortSignal[] = []
    vi.mocked(fetchPreview).mockImplementation(
      (_data: ResumeData, _template, signal) =>
        new Promise<string>((_resolve, reject) => {
          signals.push(signal)
          signal.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          )
        }),
    )
    const firstData = defaultResume()
    const { rerender } = renderHook(
      ({ data }) => usePreview(data, 'modern'),
      { initialProps: { data: firstData } },
    )
    expect(signals).toHaveLength(1)

    const secondData = {
      ...firstData,
      contact: { ...firstData.contact, full_name: 'Taylor' },
    }
    rerender({ data: secondData })
    await act(async () => {
      vi.advanceTimersByTime(600)
      await Promise.resolve()
    })

    expect(signals).toHaveLength(2)
    expect(signals[0].aborted).toBe(true)
  })
})
