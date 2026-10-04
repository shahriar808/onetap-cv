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
})
