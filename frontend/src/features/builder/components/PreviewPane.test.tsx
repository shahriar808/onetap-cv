import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { PreviewPane } from './PreviewPane'

const { usePreviewMock } = vi.hoisted(() => ({
  usePreviewMock: vi.fn(),
}))

vi.mock('../hooks/usePreview', () => ({
  usePreview: usePreviewMock,
}))

describe('PreviewPane', () => {
  beforeEach(() => {
    usePreviewMock.mockReturnValue({
      html: '<p>preview</p>',
      loading: false,
      error: null,
      retry: vi.fn(),
    })
  })

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
    expect(wrapper.parentElement?.parentElement?.className).toContain(
      'rounded-xl',
    )
    expect(wrapper.parentElement?.parentElement?.className).toContain('bg-desk')
    expect(screen.getByText('PREVIEW · A4')).not.toBeNull()
    expect(screen.getByRole('group', { name: 'Preview template' })).not.toBeNull()
  })

  it('shows an A4 loading skeleton for the first preview', () => {
    usePreviewMock.mockReturnValue({
      html: '',
      loading: true,
      error: null,
      retry: vi.fn(),
    })

    render(<PreviewPane data={defaultResume()} template="modern" />)

    expect(screen.getByRole('status', { name: 'Loading CV preview' })).not.toBeNull()
    expect(screen.queryByText('Updating…')).toBeNull()
  })

  it('shows an updating indicator while refreshing an existing preview', () => {
    usePreviewMock.mockReturnValue({
      html: '<p>preview</p>',
      loading: true,
      error: null,
      retry: vi.fn(),
    })

    render(<PreviewPane data={defaultResume()} template="modern" />)

    expect(screen.getByRole('status').textContent).toContain('Updating…')
    expect(screen.queryByRole('status', { name: 'Loading CV preview' })).toBeNull()
  })
})
