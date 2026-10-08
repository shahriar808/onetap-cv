import type { TemplateId } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'

const templates: { id: TemplateId; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
  { id: 'compact', name: 'Compact' },
]

interface PreviewToolbarProps {
  template: TemplateId
  loading: boolean
}

export function PreviewToolbar({ template, loading }: PreviewToolbarProps) {
  const setTemplate = useResumeStore((state) => state.setTemplate)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs font-semibold tracking-wide text-ink-muted">
          PREVIEW · A4
        </span>
        {loading && (
          <span
            role="status"
            className="inline-flex items-center gap-2 text-sm text-ink-soft"
          >
            <span
              aria-hidden="true"
              className="size-3 animate-spin rounded-full border-2 border-ink-muted border-r-transparent"
            />
            Updating…
          </span>
        )}
      </div>
      <div
        role="group"
        aria-label="Preview template"
        className="inline-flex rounded-lg border border-line bg-paper p-1"
      >
        {templates.map((option) => {
          const selected = template === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setTemplate(option.id)}
              className={`min-h-9 rounded-md px-3 py-1 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                selected
                  ? 'bg-ink text-paper'
                  : 'text-ink-soft hover:bg-paper-2 hover:text-ink'
              }`}
            >
              {option.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
