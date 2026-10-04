import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { SECTION_REGISTRY } from '../sections/registry'
import { SectionPicker } from './SectionPicker'

describe('SectionPicker', () => {
  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
  })

  afterEach(cleanup)

  it('lists all sections and reflects the four defaults', () => {
    render(<SectionPicker />)
    expect(SECTION_REGISTRY).toHaveLength(12)
    expect(useResumeStore.getState().data.enabled_sections).toEqual([
      'summary',
      'experience',
      'education',
      'skills',
    ])
    expect(screen.getAllByRole('switch')).toHaveLength(12)
    expect(
      (screen.getByRole('switch', { name: 'Professional Summary' }) as HTMLButtonElement)
        .getAttribute('aria-checked'),
    ).toBe('true')
    expect(
      (screen.getByRole('switch', { name: 'Projects' }) as HTMLButtonElement)
        .getAttribute('aria-checked'),
    ).toBe('false')
  })

  it('toggles sections without losing their existing data', () => {
    useResumeStore.getState().addItem('projects', {
      id: 'project-1',
      name: 'Portfolio',
      description: '',
      tech_stack: '',
      start: '',
      end: '',
      links: [],
      bullets: [],
    })
    render(<SectionPicker />)

    fireEvent.click(screen.getByRole('switch', { name: 'Projects' }))
    expect(useResumeStore.getState().data.enabled_sections).toContain('projects')
    fireEvent.click(screen.getByRole('switch', { name: 'Projects' }))

    expect(useResumeStore.getState().data.enabled_sections).not.toContain('projects')
    expect(useResumeStore.getState().data.projects[0].name).toBe('Portfolio')
  })
})
