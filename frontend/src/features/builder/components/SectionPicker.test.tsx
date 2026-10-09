import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { SECTION_REGISTRY } from '../sections/registry'
import { SectionPicker } from './SectionPicker'

describe('SectionPicker', () => {
  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({ data: defaultResume(), selectedTemplate: 'modern' })
  })
  afterEach(cleanup)

  it('shows contact first and lists enabled sections in stored order', () => {
    render(<SectionPicker />)
    const rows = screen.getByRole('list', { name: 'On your CV (in this order)' }).querySelectorAll('li')
    expect(rows[0]?.textContent).toContain('01 Contact details')
    expect(rows[0]?.querySelectorAll('button')).toHaveLength(0)
    expect(screen.getAllByText('Core')).toHaveLength(4)
    expect(rows[1]?.textContent).toContain('Professional Summary')
    expect(rows[2]?.textContent).toContain('Work Experience')
    expect(SECTION_REGISTRY).toHaveLength(12)
  })

  it('adds and removes a section without losing its saved data', () => {
    useResumeStore.getState().addItem('projects', {
      id: 'project-1', name: 'Portfolio', description: '', tech_stack: '',
      start: '', end: '', links: [], bullets: [],
    })
    render(<SectionPicker />)
    fireEvent.click(screen.getByRole('button', { name: 'Add Projects' }))
    expect(useResumeStore.getState().data.enabled_sections).toContain('projects')
    expect(useResumeStore.getState().data.section_order.at(-1)).toBe('projects')
    fireEvent.click(screen.getByRole('button', { name: 'Remove Projects' }))
    expect(useResumeStore.getState().data.enabled_sections).not.toContain('projects')
    expect(useResumeStore.getState().data.projects[0].name).toBe('Portfolio')
  })

  it('reorders sections, keeps focus, and announces the new position', () => {
    render(<SectionPicker />)
    const moveDown = screen.getByRole('button', { name: 'Move Work Experience down' })
    moveDown.focus()
    fireEvent.click(moveDown)
    expect(useResumeStore.getState().data.section_order.slice(0, 3)).toEqual(['summary', 'education', 'experience'])
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Move Work Experience down' }))
    expect(screen.getByText('Work Experience moved to position 4 of 5')).not.toBeNull()
  })

  it('disables moves at each end and keeps full descriptions visible', () => {
    render(<SectionPicker />)
    expect(screen.getByRole('button', { name: 'Move Professional Summary up' })).toHaveProperty('disabled', true)
    expect(screen.getByRole('button', { name: 'Move Skills down' })).toHaveProperty('disabled', true)
    expect(document.querySelectorAll('[data-section-id] .truncate')).toHaveLength(0)
    expect(screen.getByText(SECTION_REGISTRY.find((section) => section.id === 'experience')!.description).className).not.toContain('truncate')
  })
})
