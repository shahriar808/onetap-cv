import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { EducationForm } from './EducationForm'

describe('EducationForm', () => {
  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
  })

  afterEach(cleanup)

  it('saves GPA value and label', () => {
    render(<EducationForm />)
    fireEvent.click(screen.getByRole('button', { name: 'Add education' }))
    fireEvent.change(screen.getByLabelText('GPA'), {
      target: { value: '3.8' },
    })
    fireEvent.change(screen.getByLabelText('GPA label'), {
      target: { value: 'CGPA' },
    })

    expect(useResumeStore.getState().data.education[0]).toMatchObject({
      gpa: '3.8',
      gpa_label: 'CGPA',
    })
  })
})
