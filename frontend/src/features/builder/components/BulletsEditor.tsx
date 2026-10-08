import { useLayoutEffect, useRef } from 'react'
import { PlusIcon, XIcon } from '../../../components/icons'
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
        <div key={index} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-2 size-2 shrink-0 rounded-full bg-ink"
          />
          <div className="grid min-w-0 flex-1 gap-2">
            <label
              htmlFor={`${label}-${index}`}
              className="text-sm font-medium text-ink"
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
              className="min-h-20 w-full resize-none overflow-hidden rounded-lg border border-line bg-paper px-3 py-2 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
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
          </div>
          <Button
            variant="ghost"
            className="size-11 shrink-0 p-0 text-danger hover:bg-danger/10"
            aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
            onClick={() =>
              onChange(bullets.filter((_, itemIndex) => itemIndex !== index))
            }
          >
            <XIcon size={18} />
          </Button>
        </div>
      ))}
      <Button
        variant="ghost"
        className="w-fit"
        disabled={bullets.length >= max}
        onClick={() => onChange([...bullets, ''])}
      >
        <PlusIcon size={18} />
        Add bullet
      </Button>
    </fieldset>
  )
}
