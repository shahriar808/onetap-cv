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
  const description = error || hint

  return (
    <div className="grid gap-1.5">
      <label htmlFor={textareaId} className="text-sm font-medium text-slate-800">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <textarea
        {...props}
        id={textareaId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={`min-h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 ${className}`}
      />
      {description && (
        <p
          id={descriptionId}
          role={error ? 'alert' : undefined}
          className={error ? 'text-sm text-red-700' : 'text-sm text-slate-600'}
        >
          {description}
        </p>
      )}
    </div>
  )
}
