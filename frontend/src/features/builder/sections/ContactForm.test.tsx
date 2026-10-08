import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  afterEach(cleanup)

  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
  })

  it('shows required field validation on blur', () => {
    render(<ContactForm />)
    const email = screen.getByLabelText(/Email/)

    fireEvent.change(email, { target: { value: 'not-an-email' } })
    fireEvent.blur(email)

    expect(screen.getByRole('alert').textContent).toBe(
      'Enter a valid email address',
    )
  })

  it('updates and retains contact fields in the store', () => {
    const { unmount } = render(<ContactForm />)
    fireEvent.change(screen.getByLabelText(/Full name/), {
      target: { value: 'Taylor Example' },
    })

    expect(useResumeStore.getState().data.contact.full_name).toBe(
      'Taylor Example',
    )
    unmount()
    render(<ContactForm />)

    expect(screen.getByLabelText(/Full name/).getAttribute('value')).toBe(
      'Taylor Example',
    )
  })

  it('groups identity fields separately from contact fields', () => {
    render(<ContactForm />)

    const identityGroup = screen.getByRole('group', { name: 'Who you are' })
    const contactGroup = screen.getByRole('group', {
      name: 'How to reach you',
    })

    expect(identityGroup.contains(screen.getByLabelText(/Full name/))).toBe(true)
    expect(identityGroup.contains(screen.getByLabelText(/Job title/))).toBe(true)
    expect(contactGroup.contains(screen.getByLabelText(/Email/))).toBe(true)
    expect(contactGroup.contains(screen.getByLabelText(/Phone/))).toBe(true)
    expect(contactGroup.contains(screen.getByLabelText(/Location/))).toBe(true)
  })
})
