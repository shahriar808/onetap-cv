import { describe, expect, it } from 'vitest'
import type { EducationItem, ExperienceItem, ProjectItem, SkillGroup } from '../../../types/resume'
import { itemSummary } from './itemSummary'

describe('itemSummary', () => {
  it('formats experience dates and current roles', () => {
    const item: ExperienceItem = {
      id: 'experience-1',
      company: 'Example Inc',
      position: 'Engineer',
      location: '',
      start: '2021-03',
      end: '',
      is_current: true,
      summary: '',
      bullets: [],
    }

    expect(itemSummary('experience', item)).toBe('March 2021 – Present')
  })

  it('combines education details with the date range', () => {
    const item: EducationItem = {
      id: 'education-1',
      institution: 'Example University',
      degree: 'BSc',
      field: 'Computer Science',
      location: '',
      start: '2020',
      end: '2024',
      gpa: '',
      gpa_label: 'GPA',
      details: [],
    }

    expect(itemSummary('education', item)).toBe(
      'BSc · Computer Science · 2020 – 2024',
    )
  })

  it('summarizes skills and limits long lists', () => {
    const item: SkillGroup = {
      id: 'skills-1',
      group_name: 'Frameworks',
      items: ['React', 'TypeScript', 'Node.js', 'Vitest'],
    }

    expect(itemSummary('skills', item)).toBe('React, TypeScript, Node.js +1 more')
  })

  it('prefers project tech stacks over dates', () => {
    const item: ProjectItem = {
      id: 'project-1',
      name: 'Portfolio',
      description: '',
      tech_stack: 'React, TypeScript',
      start: '2024-01',
      end: '2024-05',
      links: [],
      bullets: [],
    }

    expect(itemSummary('projects', item)).toBe('React, TypeScript')
  })
})
