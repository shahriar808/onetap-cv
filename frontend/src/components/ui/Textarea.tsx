import { useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { FieldErrorIcon } from './Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, required, id, className = '', ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const descriptionId = `${textareaId}-description`
  const counterId = `${textareaId}-counter`
  const description = error || hint
  const value = props.value ?? props.defaultValue
  const characterCount = props.maxLength !== undefined && typeof value === 'string' ? value.length : undefined
  const describedBy = [description ? descriptionId : undefined, characterCount !== undefined ? counterId : undefined].filter(Boolean).join(' ')

  return (
    <div className="grid content-start gap-1.5">
      <div className="flex min-h-5 items-center justify-between gap-2">
        <label htmlFor={textareaId} className="text-sm font-medium text-ink">{label}</label>
        {required && <span className="font-mono text-[10px] font-medium uppercase tracking-wide text-ink-muted">Required</span>}
      </div>
      <textarea
        {...props}
        id={textareaId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn('min-h-28 w-full rounded-lg border bg-paper px-3 py-2 text-base text-ink placeholder:text-ink-muted hover:border-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent', error ? 'border-danger' : 'border-line', className)}
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
