import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { SkillsForm } from './SkillsForm'

describe('SkillsForm', () => {
  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
  })

  afterEach(cleanup)

  it('splits skills and quick-adds a named group', () => {
    render(<SkillsForm />)
    fireEvent.click(screen.getByRole('button', { name: '+ skill group' }))
    fireEvent.change(screen.getByLabelText('Skills'), {
      target: { value: 'Java, Python' },
    })

    expect(useResumeStore.getState().data.skills[0].items).toEqual([
      'Java',
      'Python',
    ])
    fireEvent.click(screen.getByRole('button', { name: 'Add Frameworks' }))
    expect(useResumeStore.getState().data.skills[1]).toMatchObject({
      group_name: 'Frameworks',
      items: [],
    })
  })
})
