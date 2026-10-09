import { createElement, type ComponentType } from 'react'
import type { SectionId } from '../../../types/resume'
import { AchievementsForm } from './AchievementsForm'
import { CertificationsForm } from './CertificationsForm'
import { EducationForm } from './EducationForm'
import { ExperienceForm } from './ExperienceForm'
import { InterestsForm } from './InterestsForm'
import { LanguagesForm } from './LanguagesForm'
import { PublicationsForm } from './PublicationsForm'
import { ProjectsForm } from './ProjectsForm'
import { ReferencesForm } from './ReferencesForm'
import { SummaryForm } from './SummaryForm'
import { SkillsForm } from './SkillsForm'
import { VolunteerForm } from './VolunteerForm'

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
    { className: 'text-sm text-ink-soft' },
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
    Form: SummaryForm,
  },
  {
    id: 'experience',
    label: 'Work Experience',
    description: 'Roles, responsibilities, and measurable achievements.',
    defaultEnabled: true,
    kind: 'list',
    Form: ExperienceForm,
  },
  {
    id: 'education',
    label: 'Education',
    description: 'Degrees, institutions, and relevant details.',
    defaultEnabled: true,
    kind: 'list',
    Form: EducationForm,
  },
  {
    id: 'skills',
    label: 'Skills',
    description: 'Technical and professional skills, grouped by type.',
    defaultEnabled: true,
    kind: 'list',
    Form: SkillsForm,
  },
  {
    id: 'projects',
    label: 'Projects',
    description: 'Selected work, tools, links, and outcomes.',
    defaultEnabled: false,
    kind: 'list',
    Form: ProjectsForm,
  },
  {
    id: 'certifications',
    label: 'Certifications',
    description: 'Professional certificates and credentials.',
    defaultEnabled: false,
    kind: 'list',
    Form: CertificationsForm,
  },
  {
    id: 'achievements',
    label: 'Achievements',
    description: 'Awards, recognition, and notable accomplishments.',
    defaultEnabled: false,
    kind: 'list',
    Form: AchievementsForm,
  },
  {
    id: 'languages',
    label: 'Languages',
    description: 'Languages you speak and your proficiency.',
    defaultEnabled: false,
    kind: 'list',
    Form: LanguagesForm,
  },
  {
    id: 'publications',
    label: 'Publications',
    description: 'Published articles, papers, and other work.',
    defaultEnabled: false,
    kind: 'list',
    Form: PublicationsForm,
  },
  {
    id: 'volunteer',
    label: 'Volunteer Experience',
    description: 'Community service and unpaid professional work.',
    defaultEnabled: false,
    kind: 'list',
    Form: VolunteerForm,
  },
  {
    id: 'interests',
    label: 'Interests',
    description: 'A few personal interests relevant to your profile.',
    defaultEnabled: false,
    kind: 'single',
    Form: InterestsForm,
  },
  {
    id: 'references',
    label: 'References',
    description: 'Professional contacts who can recommend your work.',
    defaultEnabled: false,
    kind: 'list',
    Form: ReferencesForm,
  },
]
