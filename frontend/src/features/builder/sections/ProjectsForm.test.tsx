import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { ProjectsForm } from './ProjectsForm'

describe('ProjectsForm', () => {
  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
  })

  afterEach(cleanup)

  it('adds a labeled project link and normalizes its URL', () => {
    render(<ProjectsForm />)
    fireEvent.click(screen.getByRole('button', { name: '+ project' }))
    fireEvent.click(screen.getByRole('button', { name: 'Add link' }))
    fireEvent.change(screen.getByLabelText('Link 1 label'), {
      target: { value: 'Repository' },
    })
    fireEvent.change(screen.getByLabelText('Link 1 URL'), {
      target: { value: 'github.com/example/project' },
    })
    fireEvent.blur(screen.getByLabelText('Link 1 URL'))

    expect(useResumeStore.getState().data.projects[0].links).toEqual([
      { label: 'Repository', url: 'https://github.com/example/project' },
    ])
  })
})
