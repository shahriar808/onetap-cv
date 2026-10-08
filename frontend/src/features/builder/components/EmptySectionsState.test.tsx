import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { EmptySectionsState } from './EmptySectionsState'

describe('EmptySectionsState', () => {
  afterEach(cleanup)

  it('explains the empty step and returns to section selection', () => {
    const onChooseSections = vi.fn()
    render(<EmptySectionsState onChooseSections={onChooseSections} />)

    expect(screen.getByRole('heading', { name: 'No optional sections yet' }))
      .not.toBeNull()
    expect(screen.getByText('Add a section to start filling in your experience.'))
      .not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Go to Sections to add some' }))
    expect(onChooseSections).toHaveBeenCalledOnce()
  })
})
