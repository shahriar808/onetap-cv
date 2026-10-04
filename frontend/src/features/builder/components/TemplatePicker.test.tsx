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
    ])
  })

  afterEach(cleanup)

  it('loads templates and updates the selected template', async () => {
    render(<TemplatePicker />)
    const classic = await screen.findByRole('button', { name: /Classic/ })
    fireEvent.click(classic)

    expect(useResumeStore.getState().selectedTemplate).toBe('classic')
    expect(useResumeStore.getState().data).toEqual(defaultResume())
  })
})
