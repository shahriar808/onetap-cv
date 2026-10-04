import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import { InterestsForm } from './InterestsForm'
import { SummaryForm } from './SummaryForm'

describe('summary and interests forms', () => {
  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
  })

  afterEach(cleanup)

  it('saves the professional summary', () => {
    render(<SummaryForm />)
    fireEvent.change(screen.getByLabelText('Professional summary'), {
      target: { value: 'Product-focused engineer' },
    })

    expect(useResumeStore.getState().data.summary.text).toBe(
      'Product-focused engineer',
    )
  })

  it('splits, trims and drops empty interests', () => {
    render(<InterestsForm />)
    fireEvent.change(screen.getByLabelText('Interests'), {
      target: { value: 'a, b, ,c' },
    })

    expect(useResumeStore.getState().data.interests.items).toEqual([
      'a',
      'b',
      'c',
    ])
  })
})
