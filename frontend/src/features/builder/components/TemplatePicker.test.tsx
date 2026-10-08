import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getTemplates } from '../../../lib/api'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { TemplatePicker } from './TemplatePicker'

vi.mock('../../../lib/api', () => ({
  getTemplates: vi.fn(),
}))

describe('TemplatePicker', () => {
  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
    vi.mocked(getTemplates).mockResolvedValue([
      {
        id: 'classic',
        name: 'Classic',
        description: 'A classic design',
        best_for: 'Traditional roles',
      },
      {
        id: 'modern',
        name: 'Modern',
        description: 'A modern design',
        best_for: 'Most roles',
      },
      {
        id: 'compact',
        name: 'Compact',
        description: 'A compact design',
        best_for: 'Dense experience',
      },
    ])
  })

  afterEach(cleanup)

  it('loads templates and updates the selected template', async () => {
    render(<TemplatePicker />)
    const classic = await screen.findByRole('radio', { name: 'Classic' })
    fireEvent.click(classic)

    expect(useResumeStore.getState().selectedTemplate).toBe('classic')
    expect(useResumeStore.getState().data).toEqual(defaultResume())
  })

  it('selects templates with arrow keys and wraps around the radio group', async () => {
    render(<TemplatePicker />)
    const modern = await screen.findByRole('radio', { name: 'Modern' })

    expect(screen.getByRole('radiogroup')).not.toBeNull()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(modern.getAttribute('tabindex')).toBe('0')
    expect(screen.getByRole('radio', { name: 'Classic' }).getAttribute('tabindex'))
      .toBe('-1')
    modern.focus()
    fireEvent.keyDown(modern, { key: 'ArrowRight' })

    const compact = screen.getByRole('radio', { name: 'Compact' })
    expect(compact.getAttribute('aria-checked')).toBe('true')
    expect(document.activeElement).toBe(compact)
    expect(useResumeStore.getState().selectedTemplate).toBe('compact')

    fireEvent.keyDown(compact, { key: 'ArrowRight' })
    expect(screen.getByRole('radio', { name: 'Classic' }).getAttribute('aria-checked'))
      .toBe('true')
  })
})
