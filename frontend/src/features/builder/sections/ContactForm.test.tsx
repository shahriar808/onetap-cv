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
})
