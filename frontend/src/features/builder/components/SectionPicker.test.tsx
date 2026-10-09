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
    expect(rows[0]?.textContent).toContain('Contact details')
    expect(rows[0]?.querySelectorAll('button')).toHaveLength(0)
    expect(screen.queryByText('Core')).toBeNull()
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

  it('reorders sections to a chosen position and announces the new position', () => {
    render(<SectionPicker />)
    fireEvent.change(screen.getByRole('combobox', { name: 'Position for Work Experience' }), { target: { value: '0' } })
    expect(useResumeStore.getState().data.section_order.slice(0, 4)).toEqual(['experience', 'summary', 'education', 'skills'])
    expect(screen.getByText('Work Experience moved to position 1 of 4')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Drag Work Experience to reorder' }).getAttribute('draggable')).toBeNull()
  })

  it('removes arrow controls and keeps full descriptions visible', () => {
    render(<SectionPicker />)
    expect(screen.queryByRole('button', { name: /Move .* (up|down)/ })).toBeNull()
    expect(document.querySelectorAll('[data-section-id] .truncate')).toHaveLength(0)
    expect(screen.getByText(SECTION_REGISTRY.find((section) => section.id === 'experience')!.description).className).not.toContain('truncate')
  })
})
