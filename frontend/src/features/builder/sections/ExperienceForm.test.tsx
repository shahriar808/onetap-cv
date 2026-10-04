import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { ExperienceForm } from './ExperienceForm'

describe('ExperienceForm', () => {
  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
  })

  afterEach(cleanup)

  it('saves an added experience and disables the end date for current roles', () => {
    render(<ExperienceForm />)
    fireEvent.click(screen.getByRole('button', { name: '+ experience' }))
    fireEvent.change(screen.getByLabelText('Company'), {
      target: { value: 'Example Inc' },
    })
    fireEvent.click(screen.getByLabelText('I currently work here'))

    const endMonth = screen.getAllByLabelText('Month')[1]
    const endYear = screen.getAllByLabelText('Year')[1]
    expect((endMonth as HTMLSelectElement).disabled).toBe(true)
    expect((endYear as HTMLSelectElement).disabled).toBe(true)
    expect(useResumeStore.getState().data.experience[0]).toMatchObject({
      company: 'Example Inc',
      is_current: true,
      end: '',
    })
  })
})
