import { describe, expect, it } from 'vitest'
import { defaultResume } from './defaults'

describe('defaultResume', () => {
  it('returns the version 1 defaults with the required sections enabled', () => {
    const resume = defaultResume()

    expect(resume.version).toBe(1)
    expect(resume.contact).toEqual({
      full_name: '',
      email: '',
      phone: '',
      location: '',
      job_title: '',
      links: [],
    })
    expect(resume.enabled_sections).toEqual([
      'summary',
      'experience',
      'education',
      'skills',
    ])
    expect(resume.section_order).toEqual(resume.enabled_sections)
    expect(resume.experience).toEqual([])
    expect(resume.interests).toEqual({ items: [] })
  })
})
