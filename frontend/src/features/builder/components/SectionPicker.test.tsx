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
    expect(screen.getAllByRole('button')).toHaveLength(12)
    expect(screen.getAllByText('Core')).toHaveLength(4)
    expect(
      screen
        .getByRole('button', { name: 'Professional Summary' })
        .getAttribute('aria-pressed'),
    ).toBe('true')
    expect(
      screen.getByRole('button', { name: 'Projects' }).getAttribute('aria-pressed'),
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

    fireEvent.click(screen.getByRole('button', { name: 'Projects' }))
    expect(useResumeStore.getState().data.enabled_sections).toContain('projects')
    fireEvent.click(screen.getByRole('button', { name: 'Projects' }))

    expect(useResumeStore.getState().data.enabled_sections).not.toContain('projects')
    expect(useResumeStore.getState().data.projects[0].name).toBe('Portfolio')
  })

  it('shows contact as a locked, always-included tile', () => {
    render(<SectionPicker />)

    const contactTile = screen.getByRole('group', {
      name: 'Contact details, always included',
    })
    fireEvent.click(contactTile)

    expect(contactTile.tagName).toBe('DIV')
    expect(screen.getByText('Always included')).not.toBeNull()
    expect(screen.queryByRole('button', { name: 'Contact details' })).toBeNull()
    expect(useResumeStore.getState().data.enabled_sections).toHaveLength(4)
  })

  it('keeps section tiles keyboard focusable native buttons', () => {
    render(<SectionPicker />)
    const projectsTile = screen.getByRole('button', { name: 'Projects' })

    projectsTile.focus()

    expect(document.activeElement).toBe(projectsTile)
    expect(projectsTile.getAttribute('type')).toBe('button')
    expect(projectsTile.getAttribute('aria-pressed')).toBe('false')
  })
})
