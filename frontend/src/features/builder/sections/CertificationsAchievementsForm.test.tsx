import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { AchievementsForm } from './AchievementsForm'
import { CertificationsForm } from './CertificationsForm'

describe('certifications and achievements forms', () => {
  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
  })

  afterEach(cleanup)

  it('saves an ongoing certification', () => {
    render(<CertificationsForm />)
    fireEvent.click(screen.getByRole('button', { name: 'Add certification' }))
    fireEvent.change(screen.getByLabelText('Certification name'), {
      target: { value: 'Cloud Professional' },
    })
    fireEvent.click(screen.getByLabelText('In progress / ongoing'))

    expect(useResumeStore.getState().data.certifications[0]).toMatchObject({
      name: 'Cloud Professional',
      is_ongoing: true,
    })
  })

  it('allows an achievement without a date', () => {
    render(<AchievementsForm />)
    fireEvent.click(screen.getByRole('button', { name: 'Add achievement' }))
    fireEvent.change(screen.getByLabelText('Achievement title'), {
      target: { value: 'Hackathon winner' },
    })

    expect(useResumeStore.getState().data.achievements[0]).toMatchObject({
      title: 'Hackathon winner',
      date: '',
    })
  })
})
