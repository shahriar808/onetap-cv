import { useId, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export function Textarea({
  label,
  error,
  hint,
  required,
  id,
  className = '',
  ...props
}: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const descriptionId = `${textareaId}-description`
  const counterId = `${textareaId}-counter`
  const description = error || hint
  const value = props.value ?? props.defaultValue
  const characterCount =
    props.maxLength !== undefined && typeof value === 'string'
      ? value.length
      : undefined
  const describedBy = [
    description ? descriptionId : undefined,
    characterCount !== undefined ? counterId : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={textareaId} className="text-sm font-medium text-ink">
          {label}
        </label>
        {required && (
          <span className="font-mono text-[10px] font-medium uppercase tracking-wide text-ink-muted">
            Required
          </span>
        )}
      </div>
      <textarea
        {...props}
        id={textareaId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={`min-h-28 w-full rounded-lg border bg-paper px-3 py-2 text-base text-ink placeholder:text-ink-muted hover:border-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
          error ? 'border-danger' : 'border-line'
        } ${className}`}
      />
      {characterCount !== undefined && props.maxLength !== undefined && (
        <p
          id={counterId}
          aria-live="polite"
          className={`text-right text-xs ${
            characterCount >= props.maxLength
              ? 'text-danger'
              : 'text-ink-muted'
          }`}
        >
          {characterCount} / {props.maxLength} characters
          {characterCount >= props.maxLength ? ' — limit reached' : ''}
        </p>
      )}
      {description && (
        <p
          id={descriptionId}
          role={error ? 'alert' : undefined}
          className={`flex items-start gap-1.5 text-sm ${
            error ? 'text-danger' : 'text-ink-muted'
          }`}
        >
          {error && (
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 20 20"
              className="mt-0.5 size-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <circle cx="10" cy="10" r="7.5" />
              <path d="M10 6.5v4.25m0 2.75h.01" strokeLinecap="round" />
            </svg>
          )}
          {description}
        </p>
      )}
    </div>
  )
}
