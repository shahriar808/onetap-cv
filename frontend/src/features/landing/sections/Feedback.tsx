import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { SectionHeader } from '../../../components/ui/SectionHeader'
import { Textarea } from '../../../components/ui/Textarea'
import { useToast } from '../../../components/ui/useToast'
import { FEEDBACK_EMAIL } from '../../../content/links'
import {
  FEEDBACK_TYPES,
  sendFeedback,
  type FeedbackPayload,
  type FeedbackType,
} from '../../../lib/feedback'
import { LANDING_CONTENT } from '../content'

interface FeedbackFields {
  type: FeedbackType
  message: string
  name: string
  email: string
  website: string
}

type FieldName = keyof FeedbackFields
type FieldErrors = Partial<Record<FieldName, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateFields(fields: FeedbackFields): FieldErrors {
  const errors: FieldErrors = {}
  const trimmedMessage = fields.message.trim()

  if (trimmedMessage.length < 10) {
    errors.message = 'Please enter at least 10 characters.'
  } else if (fields.message.length > 1000) {
    errors.message = 'Message must be 1,000 characters or fewer.'
  }

  if (fields.name.trim().length > 80) {
    errors.name = 'Name must be 80 characters or fewer.'
  }

  if (fields.email && !EMAIL_PATTERN.test(fields.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  return errors
}

function mailtoHref(email: string, message: string): string {
  const subject = encodeURIComponent('OneTap CV feedback')
  const body = encodeURIComponent(message)
  return `mailto:${email}?subject=${subject}&body=${body}`
}

export function Feedback() {
  const { showToast } = useToast()
  const mountedAt = useRef(0)
  const [fields, setFields] = useState<FeedbackFields>({
    type: 'idea',
    message: '',
    name: '',
    email: '',
    website: '',
  })
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  )
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [requestError, setRequestError] = useState('')
  const errors = validateFields(fields)

  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  function updateField<Key extends FieldName>(
    field: Key,
    value: FeedbackFields[Key],
  ) {
    setFields((current) => ({ ...current, [field]: value }))
  }

  function visibleError(field: FieldName): string | undefined {
    return submitted || touched[field] ? errors[field] : undefined
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    setRequestError('')

    if (Object.keys(errors).length > 0) {
      return
    }

    const payload: FeedbackPayload = {
      ...fields,
      elapsed_ms: Math.max(0, Date.now() - mountedAt.current),
    }

    setSending(true)
    try {
      await sendFeedback(payload)
      setSuccess(true)
      showToast(LANDING_CONTENT.feedback.success)
    } catch (error) {
      setRequestError(
        error instanceof Error ? error.message : LANDING_CONTENT.feedback.error,
      )
    } finally {
      setSending(false)
    }
  }

  function sendAnother() {
    setFields({
      type: 'idea',
      message: '',
      name: '',
      email: '',
      website: '',
    })
    setTouched({})
    setSubmitted(false)
    setRequestError('')
    mountedAt.current = Date.now()
    setSuccess(false)
  }

  return (
    <section id="feedback" className="bg-paper-2 py-8 sm:py-12">
      <div className="container-page grid gap-8 lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-16">
        <div className="grid content-start justify-items-start gap-4">
          <SectionHeader
            index={10}
            label="Feedback"
            title={LANDING_CONTENT.feedback.title}
          />
          <p className="max-w-[62ch] text-ink-soft">
            {LANDING_CONTENT.feedback.sub}
          </p>
          {FEEDBACK_EMAIL && (
            <a
              href={`mailto:${FEEDBACK_EMAIL}`}
              className="inline-flex min-h-11 items-center font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              Email me directly
            </a>
          )}
        </div>

        <div className="min-w-0">
          {success ? (
            <div
              role="status"
              aria-live="polite"
              className="grid justify-items-start gap-4 rounded-xl border border-line bg-paper p-6 sm:p-8"
            >
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-full bg-moss/10 font-semibold text-moss"
              >
                ✓
              </span>
              <h3 className="font-display text-display-md font-semibold text-ink">
                {LANDING_CONTENT.feedback.success}
              </h3>
              <button
                type="button"
                onClick={sendAnother}
                className="inline-flex min-h-11 items-center font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              id="feedback-form"
              noValidate
              onSubmit={handleSubmit}
              className="grid gap-5 rounded-xl border border-line bg-paper p-5 sm:gap-6 sm:p-8"
            >
              <fieldset className="grid gap-2">
                <legend className="text-sm font-medium text-ink">
                  What would you like to share?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_TYPES.map((option) => (
                    <label
                      key={option.value}
                      className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-accent ${
                        fields.type === option.value
                          ? 'border-ink bg-ink text-paper'
                          : 'border-line bg-paper text-ink hover:bg-paper-2'
                      }`}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        name="type"
                        value={option.value}
                        checked={fields.type === option.value}
                        onChange={() => updateField('type', option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-1.5">
                <Textarea
                  label="Message"
                  required
                  value={fields.message}
                  onChange={(event) =>
                    updateField('message', event.currentTarget.value)
                  }
                  onBlur={() =>
                    setTouched((current) => ({ ...current, message: true }))
                  }
                  error={visibleError('message')}
                  placeholder="Tell me what happened or what you'd like to see."
                  rows={5}
                />
                <p className="text-right text-xs text-ink-muted" aria-live="polite">
                  {fields.message.length}/1000
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Name"
                  value={fields.name}
                  onChange={(event) =>
                    updateField('name', event.currentTarget.value)
                  }
                  onBlur={() =>
                    setTouched((current) => ({ ...current, name: true }))
                  }
                  error={visibleError('name')}
                  autoComplete="name"
                />
                <Input
                  label="Email"
                  type="email"
                  value={fields.email}
                  onChange={(event) =>
                    updateField('email', event.currentTarget.value)
                  }
                  onBlur={() =>
                    setTouched((current) => ({ ...current, email: true }))
                  }
                  error={visibleError('email')}
                  hint="Only if you'd like a reply."
                  autoComplete="email"
                />
              </div>

              <div
                aria-hidden="true"
                className="absolute -left-[10000px] h-px w-px overflow-hidden"
              >
                <label htmlFor="feedback-website">Leave this field empty</label>
                <input
                  id="feedback-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={fields.website}
                  onChange={(event) =>
                    updateField('website', event.currentTarget.value)
                  }
                />
              </div>

              {requestError && (
                <div className="grid gap-2">
                  <p role="alert" className="text-sm text-danger">
                    {requestError}
                  </p>
                  {FEEDBACK_EMAIL && (
                    <a
                      href={mailtoHref(FEEDBACK_EMAIL, fields.message)}
                      className="inline-flex min-h-11 w-fit items-center font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      Email me instead
                    </a>
                  )}
                </div>
              )}

              <Button type="submit" loading={sending} className="w-fit">
                {requestError ? 'Retry' : 'Send feedback'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
