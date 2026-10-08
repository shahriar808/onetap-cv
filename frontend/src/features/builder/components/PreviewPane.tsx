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
import { PreviewToolbar } from './PreviewToolbar'

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
      <div className="grid gap-3">
        <h2
          id="preview-title"
          className="font-display text-lg font-semibold text-ink"
        >
          Live preview
        </h2>
        <PreviewToolbar template={template} loading={loading && Boolean(html)} />
      </div>
      <div
        className="relative min-h-64 overflow-auto rounded-xl border border-line bg-desk p-3 sm:p-4"
      >
        <div ref={containerRef} className="mx-auto min-w-0">
          <div
            data-testid="preview-document"
            className="relative mx-auto w-full shadow-paper"
            style={{ height: contentHeight * scale, maxWidth: PREVIEW_WIDTH }}
          >
            <div
              data-testid="preview-document-content"
              className="absolute left-0 top-0 origin-top-left border border-line bg-white"
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
        </div>
        {loading && !html && (
          <div
            role="status"
            aria-label="Loading CV preview"
            className="absolute inset-3 grid place-items-start sm:inset-4"
          >
            <div className="mx-auto grid aspect-[794/1123] w-full max-w-[794px] content-start gap-4 border border-line bg-paper p-6 shadow-paper sm:p-8">
              <span className="h-5 w-2/5 animate-pulse rounded bg-paper-2" />
              <span className="h-2 w-full animate-pulse rounded bg-paper-2" />
              <span className="h-2 w-4/5 animate-pulse rounded bg-paper-2" />
              <span className="h-2 w-11/12 animate-pulse rounded bg-paper-2" />
              <span className="mt-4 h-4 w-1/3 animate-pulse rounded bg-paper-2" />
              <span className="h-2 w-full animate-pulse rounded bg-paper-2" />
              <span className="h-2 w-5/6 animate-pulse rounded bg-paper-2" />
              <span className="h-2 w-4/5 animate-pulse rounded bg-paper-2" />
              <span className="h-16 w-full animate-pulse rounded bg-paper-2" />
            </div>
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="absolute inset-3 grid content-center justify-items-center gap-3 rounded-lg bg-paper/95 p-5 text-center sm:inset-4"
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
