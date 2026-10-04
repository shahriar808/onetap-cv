import type { ResumeData } from '../types/resume'

export type TemplateId = 'classic' | 'modern' | 'compact'

export function defaultResume(): ResumeData {
  return {
    version: 1,
    contact: {
      full_name: '',
      email: '',
      phone: '',
      location: '',
      job_title: '',
      links: [],
    },
    enabled_sections: ['summary', 'experience', 'education', 'skills'],
    section_order: ['summary', 'experience', 'education', 'skills'],
    summary: { text: '' },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    publications: [],
    volunteer: [],
    interests: { items: [] },
    references: [],
  }
}
