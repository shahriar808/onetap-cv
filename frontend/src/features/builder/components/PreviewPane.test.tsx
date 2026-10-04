import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { PreviewPane } from './PreviewPane'

vi.mock('../hooks/usePreview', () => ({
  usePreview: () => ({
    html: '<p>preview</p>',
    loading: false,
    error: null,
    retry: vi.fn(),
  }),
}))

describe('PreviewPane', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('reserves only the scaled document height with matching rounded styling', () => {
    let resizeCallback: ResizeObserverCallback | undefined
    class MockResizeObserver implements ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback
      }
      observe(target: Element) {
        resizeCallback?.(
          [
            {
              target,
              contentRect: { width: 397 },
            } as ResizeObserverEntry,
          ],
          this,
        )
      }
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', MockResizeObserver)

    render(<PreviewPane data={defaultResume()} template="modern" />)

    const wrapper = screen.getByTestId('preview-document')
    const content = screen.getByTestId('preview-document-content')
    expect((wrapper as HTMLDivElement).style.height).toBe('561.5px')
    expect((content as HTMLDivElement).style.height).toBe('1123px')
    expect((content as HTMLDivElement).style.transform).toBe('scale(0.5)')
    expect(wrapper.parentElement?.className).toContain('rounded-xl')
  })
})
