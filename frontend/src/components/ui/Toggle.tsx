interface ToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleProps) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4">
      <div>
        <p className="font-medium text-ink">{label}</p>
        {description && <p className="text-sm text-ink-soft">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="flex h-11 w-12 shrink-0 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          className={`relative inline-flex h-7 w-12 items-center rounded-full p-1 transition ${
            checked ? 'bg-ink' : 'bg-line'
          }`}
        >
          {checked && (
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 16 16"
              className="absolute left-1.5 size-3 text-paper"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m3 8 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <span
            aria-hidden="true"
            className={`z-10 h-5 w-5 rounded-full bg-paper transition-transform ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </span>
      </button>
    </div>
  )
}
