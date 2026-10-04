import { useState } from 'react'
import { Input } from '../../../components/ui/Input'
import { useResumeStore } from '../../../store/resumeStore'
import { validateContact } from '../../../lib/validation'

type RequiredContactField = 'full_name' | 'email' | 'phone'

export function ContactForm() {
  const contact = useResumeStore((state) => state.data.contact)
  const updateContact = useResumeStore((state) => state.updateContact)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validateField(field: RequiredContactField) {
    const result = validateContact(contact)
    setErrors((current) => {
      const next = { ...current }
      if (result.errors[field]) {
        next[field] = result.errors[field]
      } else {
        delete next[field]
      }
      return next
    })
  }

  function contactInput(
    field: RequiredContactField,
    label: string,
    type: string,
  ) {
    function updateValue(value: string) {
      if (field === 'full_name') {
        updateContact({ full_name: value })
      } else if (field === 'email') {
        updateContact({ email: value })
      } else {
        updateContact({ phone: value })
      }
    }

    return (
      <Input
        label={label}
        type={type}
        required
        value={contact[field]}
        error={errors[field]}
        onChange={(event) =>
          updateValue(event.currentTarget.value)
        }
        onBlur={() => validateField(field)}
      />
    )
  }

  return (
    <section aria-labelledby="contact-form-title" className="grid gap-4">
      <div>
        <h2 id="contact-form-title" className="text-xl font-semibold">
          Contact information
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          These required details appear at the top of your CV.
        </p>
      </div>
      {contactInput('full_name', 'Full name', 'text')}
      {contactInput('email', 'Email', 'email')}
      {contactInput('phone', 'Phone', 'tel')}
      <Input
        label="Location"
        value={contact.location}
        onChange={(event) =>
          updateContact({ location: event.currentTarget.value })
        }
      />
      <Input
        label="Job title"
        value={contact.job_title}
        onChange={(event) =>
          updateContact({ job_title: event.currentTarget.value })
        }
      />
      <p role="status" className="text-sm text-slate-600">
        Contact details save automatically in this browser.
      </p>
    </section>
  )
}
