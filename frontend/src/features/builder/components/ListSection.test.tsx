import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defaultResume } from '../../../lib/defaults'
import { useResumeStore } from '../../../store/resumeStore'
import type { ExperienceItem } from '../../../types/resume'
import { ListSection } from './ListSection'

const emptyExperience = (): ExperienceItem => ({
  id: crypto.randomUUID(),
  company: '',
  position: '',
  location: '',
  start: '',
  end: '',
  is_current: false,
  summary: '',
  bullets: [],
})

function renderExperienceList() {
  return render(
    <ListSection
      sectionId="experience"
      itemTitle={(item) => item.company || 'New experience'}
      renderItem={(item, update) => (
        <label>
          Company
          <input
            value={item.company}
            onChange={(event) => update({ company: event.currentTarget.value })}
          />
        </label>
      )}
      emptyItem={emptyExperience}
      addLabel="experience"
    />,
  )
}

describe('ListSection', () => {
  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
  })

  afterEach(cleanup)

  it('adds items and reorders them', () => {
    renderExperienceList()
    fireEvent.click(screen.getByRole('button', { name: '+ experience' }))
    fireEvent.change(screen.getByLabelText('Company'), {
      target: { value: 'First Inc' },
    })
    fireEvent.click(screen.getByRole('button', { name: '+ experience' }))
    fireEvent.change(screen.getAllByLabelText('Company')[1], {
      target: { value: 'Second Inc' },
    })

    const firstMoveUp = screen.getByRole('button', { name: 'Move First Inc up' })
    expect((firstMoveUp as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Move Second Inc up' }))

    expect(useResumeStore.getState().data.experience.map((item) => item.company))
      .toEqual(['Second Inc', 'First Inc'])
  })

  it('confirms deleting a filled item but immediately deletes an empty one', () => {
    renderExperienceList()
    fireEvent.click(screen.getByRole('button', { name: '+ experience' }))
    fireEvent.change(screen.getByLabelText('Company'), {
      target: { value: 'Filled Inc' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Delete Filled Inc' }))

    expect(screen.getByRole('dialog')).not.toBeNull()
    expect(useResumeStore.getState().data.experience).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: /^Delete$/ }))
    expect(useResumeStore.getState().data.experience).toHaveLength(0)

    fireEvent.click(screen.getByRole('button', { name: '+ experience' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete New experience' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(useResumeStore.getState().data.experience).toHaveLength(0)
  })
})
