import { useId, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, required, id, className = '', ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = `${inputId}-description`
  const counterId = `${inputId}-counter`
  const description = error || hint
  const value = props.value ?? props.defaultValue
  const characterCount = props.maxLength !== undefined && (typeof value === 'string' || typeof value === 'number')
    ? String(value).length
    : undefined
  const describedBy = [description ? descriptionId : undefined, characterCount !== undefined ? counterId : undefined].filter(Boolean).join(' ')

  return (
    <div className="grid content-start gap-1.5">
      <div className="flex min-h-5 items-center justify-between gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-ink">{label}</label>
        {required && <span className="font-mono text-[10px] font-medium uppercase tracking-wide text-ink-muted">Required</span>}
      </div>
      <input
        {...props}
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn('min-h-11 w-full rounded-lg border bg-paper px-3 text-base text-ink placeholder:text-ink-muted hover:border-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent', error ? 'border-danger' : 'border-line', className)}
      />
      <div className="flex min-h-5 items-start justify-between gap-3">
        {description ? (
          <p id={descriptionId} role={error ? 'alert' : undefined} className={cn('flex min-w-0 items-start gap-1.5 text-sm leading-5', error ? 'text-danger' : 'text-ink-muted')}>
            {error && <FieldErrorIcon />}
            {description}
          </p>
        ) : <span />}
        {characterCount !== undefined && props.maxLength !== undefined && (
          <p id={counterId} aria-live="polite" className={cn('shrink-0 text-right text-xs leading-5', characterCount >= props.maxLength ? 'text-danger' : 'text-ink-muted')}>
            {characterCount} / {props.maxLength} characters{characterCount >= props.maxLength ? ' — limit reached' : ''}
          </p>
        )}
      </div>
    </div>
  )
}

export function FieldErrorIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 6.5v4.25m0 2.75h.01" strokeLinecap="round" />
    </svg>
  )
}
