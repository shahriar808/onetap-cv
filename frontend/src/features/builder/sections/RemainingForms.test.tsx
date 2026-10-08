import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { ComingSoonForm, SECTION_REGISTRY } from './registry'
import { LanguagesForm } from './LanguagesForm'
import { PublicationsForm } from './PublicationsForm'
import { ReferencesForm } from './ReferencesForm'
import { VolunteerForm } from './VolunteerForm'

describe('remaining section forms', () => {
  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
  })

  afterEach(cleanup)

  it('saves data from languages, publications, volunteer and references', () => {
    const { rerender } = render(<LanguagesForm />)
    fireEvent.click(screen.getByRole('button', { name: 'Add language' }))
    fireEvent.change(screen.getByLabelText('Language'), {
      target: { value: 'English' },
    })
    expect(useResumeStore.getState().data.languages[0].language).toBe('English')

    rerender(<PublicationsForm />)
    fireEvent.click(screen.getByRole('button', { name: 'Add publication' }))
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Research paper' },
    })
    expect(useResumeStore.getState().data.publications[0].title).toBe(
      'Research paper',
    )

    rerender(<VolunteerForm />)
    fireEvent.click(
      screen.getByRole('button', { name: 'Add volunteer experience' }),
    )
    fireEvent.change(screen.getByLabelText('Organization'), {
      target: { value: 'Community Group' },
    })
    expect(useResumeStore.getState().data.volunteer[0].organization).toBe(
      'Community Group',
    )

    rerender(<ReferencesForm />)
    fireEvent.click(screen.getByRole('button', { name: 'Add reference' }))
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Taylor Example' },
    })
    expect(useResumeStore.getState().data.references[0].name).toBe(
      'Taylor Example',
    )
  })

  it('registers a real form for every section', () => {
    expect(SECTION_REGISTRY).toHaveLength(12)
    expect(SECTION_REGISTRY.every(({ Form }) => Form !== ComingSoonForm)).toBe(
      true,
    )
  })
})
