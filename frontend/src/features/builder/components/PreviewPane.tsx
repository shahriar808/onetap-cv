import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react'
import { Button } from '../../../components/ui/Button'
import type { TemplateId } from '../../../lib/defaults'
import type { ResumeData } from '../../../types/resume'
import { usePreview } from '../hooks/usePreview'

const PREVIEW_WIDTH = 794

interface PreviewPaneProps {
  data: ResumeData
  template: TemplateId
}

export function PreviewPane({ data, template }: PreviewPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(PREVIEW_WIDTH)
  const [contentHeight, setContentHeight] = useState(1123)
  const { html, loading, error, retry } = usePreview(data, template)
  const scale = Math.min(1, containerWidth / PREVIEW_WIDTH)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    function updateWidth() {
      const container = containerRef.current
      if (!container) {
        return
      }
      const width = container.clientWidth
      if (width > 0) {
        setContainerWidth(width)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    if (typeof ResizeObserver === 'undefined') {
      return () => window.removeEventListener('resize', updateWidth)
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry && entry.contentRect.width > 0) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    resizeObserver.observe(containerRef.current)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateWidth)
    }
  }, [])

  const updateContentHeight = useCallback(
    (event: SyntheticEvent<HTMLIFrameElement>) => {
      const height = event.currentTarget.contentDocument?.documentElement
        .scrollHeight
      if (height && height > 0) {
        setContentHeight(height)
      }
    },
    [],
  )

  return (
    <section
      aria-labelledby="preview-title"
      className="grid min-w-0 gap-3"
    >
      <h2 id="preview-title" className="text-lg font-semibold text-slate-900">
        Live preview
      </h2>
      <div
        ref={containerRef}
        className="relative min-h-64 overflow-hidden rounded-xl border border-slate-200 bg-white"
      >
        <div
          data-testid="preview-document"
          className="relative w-full"
          style={{
            height: contentHeight * scale,
          }}
        >
          <div
            data-testid="preview-document-content"
            className="absolute left-0 top-0 origin-top-left"
            style={{
              width: PREVIEW_WIDTH,
              height: contentHeight,
              transform: `scale(${scale})`,
            }}
          >
            <iframe
              title="CV preview"
              sandbox="allow-same-origin"
              srcDoc={html}
              onLoad={updateContentHeight}
              className="block border-0 bg-white"
              style={{ width: PREVIEW_WIDTH, height: contentHeight }}
            />
          </div>
        </div>
        {loading && (
          <div
            role="status"
            className="absolute inset-0 grid place-items-center bg-white/90 p-6 text-sm font-medium text-slate-700"
          >
            {html ? (
              'Updating preview…'
            ) : (
              <div
                className="grid w-full max-w-sm gap-4"
                aria-label="Loading CV preview"
              >
                <span>Preparing your CV preview…</span>
                <span className="h-5 animate-pulse rounded bg-slate-200" />
                <span className="h-3 animate-pulse rounded bg-slate-200" />
                <span className="h-3 animate-pulse rounded bg-slate-200" />
                <span className="h-20 animate-pulse rounded bg-slate-100" />
              </div>
            )}
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="absolute inset-0 grid content-center justify-items-center gap-3 bg-white/95 p-5 text-center"
          >
            <p className="text-sm text-red-700">{error}</p>
            <Button variant="secondary" onClick={retry}>
              Retry preview
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
