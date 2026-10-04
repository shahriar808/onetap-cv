import { z } from 'zod'
import type { Contact } from '../types/resume'

export const contactSchema = z.object({
  full_name: z.string().trim().min(1, 'Enter your full name').max(100),
  email: z.email('Enter a valid email address'),
  phone: z.string().trim().min(5, 'Enter a phone number with at least 5 characters').max(30),
})

export interface ContactValidation {
  ok: boolean
  errors: Record<string, string>
}

export function validateContact(contact: Contact): ContactValidation {
  const result = contactSchema.safeParse(contact)
  if (result.success) {
    return { ok: true, errors: {} }
  }

  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0]
    if (typeof field === 'string' && errors[field] === undefined) {
      errors[field] = issue.message
    }
  }

  return { ok: false, errors }
}

export function normalizeUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed || /^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
}
