import { describe, expect, it } from 'vitest'
import type { Contact } from '../types/resume'
import { normalizeUrl, validateContact } from './validation'

const validContact: Contact = {
  full_name: 'Taylor Example',
  email: 'taylor@example.com',
  phone: '+1 555 555 0100',
  location: '',
  job_title: '',
  links: [],
}

describe('contact validation', () => {
  it('accepts valid required contact fields', () => {
    expect(validateContact(validContact)).toEqual({ ok: true, errors: {} })
  })

  it('returns field errors for missing required information', () => {
    const result = validateContact({
      ...validContact,
      email: '',
      phone: '123',
    })

    expect(result.ok).toBe(false)
    expect(result.errors.email).toBeTruthy()
    expect(result.errors.phone).toBeTruthy()
  })
})

describe('normalizeUrl', () => {
  it('adds a secure scheme when the URL has no HTTP scheme', () => {
    expect(normalizeUrl('github.com/example')).toBe(
      'https://github.com/example',
    )
  })

  it('preserves existing HTTP schemes and empty values', () => {
    expect(normalizeUrl('https://github.com/example')).toBe(
      'https://github.com/example',
    )
    expect(normalizeUrl('')).toBe('')
  })
})
