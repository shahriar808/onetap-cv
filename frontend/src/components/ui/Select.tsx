import { useId, type ReactNode, type SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { FieldErrorIcon } from './Input'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

export function Select({ label, error, hint, required, id, className = '', children, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const descriptionId = `${selectId}-description`
  const description = error || hint

  return (
    <div className="grid content-start gap-1.5">
      <div className="flex min-h-5 items-center justify-between gap-2">
        <label htmlFor={selectId} className="text-sm font-medium text-ink">{label}</label>
        {required && <span className="font-mono text-[10px] font-medium uppercase tracking-wide text-ink-muted">Required</span>}
      </div>
      <span className="relative">
        <select
          {...props}
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={description ? descriptionId : undefined}
          className={cn('min-h-11 w-full appearance-none rounded-lg border bg-paper px-3 pr-10 text-base text-ink hover:border-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-paper-2', error ? 'border-danger' : 'border-line', className)}
        >
          {children}
        </select>
        <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="flex min-h-5 items-start gap-3">
        {description ? (
          <p id={descriptionId} role={error ? 'alert' : undefined} className={cn('flex min-w-0 items-start gap-1.5 text-sm leading-5', error ? 'text-danger' : 'text-ink-muted')}>
            {error && <FieldErrorIcon />}{description}
          </p>
        ) : <span />}
      </div>
    </div>
  )
}
