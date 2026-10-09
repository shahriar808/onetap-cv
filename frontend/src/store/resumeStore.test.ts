import { beforeEach, describe, expect, it } from 'vitest'
import { defaultResume } from '../lib/defaults'
import { useResumeStore } from './resumeStore'

describe('resume store', () => {
  beforeEach(() => {
    useResumeStore.persist.clearStorage()
    useResumeStore.setState({
      data: defaultResume(),
      selectedTemplate: 'modern',
    })
  })

  it('merges contact updates', () => {
    useResumeStore.getState().updateContact({
      full_name: 'Taylor Example',
      email: 'taylor@example.com',
    })

    expect(useResumeStore.getState().data.contact).toMatchObject({
      full_name: 'Taylor Example',
      email: 'taylor@example.com',
      phone: '',
    })
  })

  it('updates the selected template', () => {
    useResumeStore.getState().setTemplate('classic')

    expect(useResumeStore.getState().selectedTemplate).toBe('classic')
  })

  it('resets the data and selected template', () => {
    useResumeStore.getState().updateContact({ full_name: 'Taylor Example' })
    useResumeStore.getState().setTemplate('compact')

    useResumeStore.getState().resetAll()

    expect(useResumeStore.getState().data).toEqual(defaultResume())
    expect(useResumeStore.getState().selectedTemplate).toBe('modern')
  })

  it('persists updated data under the configured key', () => {
    useResumeStore.getState().updateContact({ full_name: 'Taylor Example' })

    const stored = localStorage.getItem('cvbuilder:v1')

    expect(stored).not.toBeNull()
    expect(JSON.parse(stored!).state.data.contact.full_name).toBe(
      'Taylor Example',
    )
  })

  it('keeps section data when toggled off and on', () => {
    useResumeStore.getState().addItem('experience', {
      id: 'experience-1',
      company: 'Example Inc',
      position: 'Engineer',
      location: '',
      start: '',
      end: '',
      is_current: false,
      summary: '',
      bullets: [],
    })

    useResumeStore.getState().toggleSection('experience')
    expect(useResumeStore.getState().data.enabled_sections).not.toContain(
      'experience',
    )

    useResumeStore.getState().toggleSection('experience')

    expect(useResumeStore.getState().data.experience[0].company).toBe(
      'Example Inc',
    )
    expect(useResumeStore.getState().data.section_order.at(-1)).toBe(
      'experience',
    )
  })

  it('moves enabled sections and skips disabled entries', () => {
    useResumeStore.setState((state) => ({
      data: {
        ...state.data,
        enabled_sections: ['summary', 'experience', 'skills'],
        section_order: ['summary', 'projects', 'experience', 'skills'],
      },
    }))
    useResumeStore.getState().moveSection('skills', 'up')
    expect(useResumeStore.getState().data.section_order).toEqual(['summary', 'projects', 'skills', 'experience'])
    useResumeStore.getState().moveSection('summary', 'up')
    useResumeStore.getState().moveSection('experience', 'down')
    expect(useResumeStore.getState().data.section_order).toEqual(['summary', 'projects', 'skills', 'experience'])
    expect(new Set(useResumeStore.getState().data.section_order).size).toBe(4)
  })

  it('supports list item add, update, remove and reorder actions', () => {
    const store = useResumeStore.getState()
    const firstItem = {
      id: 'first',
      company: 'First Inc',
      position: 'Engineer',
      location: '',
      start: '',
      end: '',
      is_current: false,
      summary: '',
      bullets: [],
    }
    const secondItem = { ...firstItem, id: 'second', company: 'Second Inc' }

    store.addItem('experience', firstItem)
    store.addItem('experience', secondItem)
    store.updateItem('experience', 'first', { position: 'Senior Engineer' })
    store.moveItem('experience', 0, 1)

    expect(useResumeStore.getState().data.experience.map((item) => item.id)).toEqual([
      'second',
      'first',
    ])
    expect(useResumeStore.getState().data.experience[1].position).toBe(
      'Senior Engineer',
    )

    store.moveItem('experience', 0, 99)
    expect(useResumeStore.getState().data.experience.map((item) => item.id)).toEqual([
      'second',
      'first',
    ])

    store.removeItem('experience', 'second')
    expect(useResumeStore.getState().data.experience).toHaveLength(1)
    expect(useResumeStore.getState().data.experience[0].id).toBe('first')
  })

  it('updates single sections', () => {
    useResumeStore.getState().updateSingle('summary', { text: 'Summary text' })
    useResumeStore.getState().updateSingle('interests', {
      items: ['Reading'],
    })

    expect(useResumeStore.getState().data.summary.text).toBe('Summary text')
    expect(useResumeStore.getState().data.interests.items).toEqual(['Reading'])
  })
})
