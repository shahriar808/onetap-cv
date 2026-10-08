import { useLayoutEffect, useRef } from 'react'
import { Button } from '../../../components/ui/Button'

interface BulletsEditorProps {
  bullets: string[]
  onChange: (bullets: string[]) => void
  max?: number
  maxLength?: number
  label: string
}

export function BulletsEditor({
  bullets,
  onChange,
  max = 15,
  maxLength = 300,
  label,
}: BulletsEditorProps) {
  const textareaRefs = useRef<Array<HTMLTextAreaElement | null>>([])

  useLayoutEffect(() => {
    textareaRefs.current.forEach((textarea) => {
      if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    })
  }, [bullets])

  return (
    <fieldset className="grid gap-3">
      <legend className="font-semibold text-slate-900">{label}</legend>
      {bullets.map((bullet, index) => (
        <div key={index} className="grid gap-2">
          <label
            htmlFor={`${label}-${index}`}
            className="text-sm font-medium text-slate-800"
          >
            {label} {index + 1}
          </label>
          <textarea
            ref={(element) => {
              textareaRefs.current[index] = element
            }}
            id={`${label}-${index}`}
            value={bullet}
            maxLength={maxLength}
            onChange={(event) =>
              onChange(
                bullets.map((value, itemIndex) =>
                  itemIndex === index ? event.currentTarget.value : value,
                ),
              )
            }
            className="min-h-20 w-full resize-none overflow-hidden rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
          />
          <p
            className={`text-right text-xs ${
              bullet.length >= maxLength ? 'text-danger' : 'text-ink-muted'
            }`}
            aria-live="polite"
          >
            {bullet.length} / {maxLength} characters
            {bullet.length >= maxLength ? ' — limit reached' : ''}
          </p>
          <Button
            variant="ghost"
            className="w-fit"
            aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
            onClick={() =>
              onChange(bullets.filter((_, itemIndex) => itemIndex !== index))
            }
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        variant="secondary"
        className="w-fit"
        disabled={bullets.length >= max}
        onClick={() => onChange([...bullets, ''])}
      >
        + Add bullet
      </Button>
    </fieldset>
  )
}
