import { createElement, type ComponentType } from 'react'
import type { SectionId } from '../../../types/resume'

export interface SectionConfig {
  id: SectionId
  label: string
  description: string
  defaultEnabled: boolean
  kind: 'single' | 'list'
  Form: ComponentType
}

export function ComingSoonForm() {
  return createElement(
    'p',
    { className: 'text-sm text-slate-600' },
    'This section is being prepared. Your information will be saved here soon.',
  )
}

export const SECTION_REGISTRY: SectionConfig[] = [
  {
    id: 'summary',
    label: 'Professional Summary',
    description: 'A concise overview of your experience and goals.',
    defaultEnabled: true,
    kind: 'single',
    Form: ComingSoonForm,
  },
  {
    id: 'experience',
    label: 'Work Experience',
    description: 'Roles, responsibilities, and measurable achievements.',
    defaultEnabled: true,
    kind: 'list',
    Form: ComingSoonForm,
  },
  {
    id: 'education',
    label: 'Education',
    description: 'Degrees, institutions, and relevant details.',
    defaultEnabled: true,
    kind: 'list',
    Form: ComingSoonForm,
  },
  {
    id: 'skills',
    label: 'Skills',
    description: 'Technical and professional skills, grouped by type.',
    defaultEnabled: true,
    kind: 'list',
    Form: ComingSoonForm,
  },
  {
    id: 'projects',
    label: 'Projects',
    description: 'Selected work, tools, links, and outcomes.',
    defaultEnabled: false,
    kind: 'list',
    Form: ComingSoonForm,
  },
  {
    id: 'certifications',
    label: 'Certifications',
    description: 'Professional certificates and credentials.',
    defaultEnabled: false,
    kind: 'list',
    Form: ComingSoonForm,
  },
  {
    id: 'achievements',
    label: 'Achievements',
    description: 'Awards, recognition, and notable accomplishments.',
    defaultEnabled: false,
    kind: 'list',
    Form: ComingSoonForm,
  },
  {
    id: 'languages',
    label: 'Languages',
    description: 'Languages you speak and your proficiency.',
    defaultEnabled: false,
    kind: 'list',
    Form: ComingSoonForm,
  },
  {
    id: 'publications',
    label: 'Publications',
    description: 'Published articles, papers, and other work.',
    defaultEnabled: false,
    kind: 'list',
    Form: ComingSoonForm,
  },
  {
    id: 'volunteer',
    label: 'Volunteer Experience',
    description: 'Community service and unpaid professional work.',
    defaultEnabled: false,
    kind: 'list',
    Form: ComingSoonForm,
  },
  {
    id: 'interests',
    label: 'Interests',
    description: 'A few personal interests relevant to your profile.',
    defaultEnabled: false,
    kind: 'single',
    Form: ComingSoonForm,
  },
  {
    id: 'references',
    label: 'References',
    description: 'Professional contacts who can recommend your work.',
    defaultEnabled: false,
    kind: 'list',
    Form: ComingSoonForm,
  },
]
