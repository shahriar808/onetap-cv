export type SectionId =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'achievements'
  | 'languages'
  | 'publications'
  | 'volunteer'
  | 'interests'
  | 'references'

export type ContactLinkType =
  | 'LinkedIn'
  | 'GitHub'
  | 'Portfolio'
  | 'LeetCode'
  | 'Other'

export interface LinkItem {
  id: string
  type: ContactLinkType
  url: string
}

export interface Contact {
  full_name: string
  email: string
  phone: string
  location: string
  job_title: string
  links: LinkItem[]
}

export interface ExperienceItem {
  id: string
  company: string
  position: string
  location: string
  start: string
  end: string
  is_current: boolean
  summary: string
  bullets: string[]
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  start: string
  end: string
  gpa: string
  gpa_label: 'GPA' | 'CGPA'
  details: string[]
}

export interface SkillGroup {
  id: string
  group_name: string
  items: string[]
}

export interface ProjectLink {
  label: string
  url: string
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  tech_stack: string
  start: string
  end: string
  links: ProjectLink[]
  bullets: string[]
}

export interface CertificationItem {
  id: string
  name: string
  issuer: string
  date: string
  is_ongoing: boolean
  link: string
}

export interface AchievementItem {
  id: string
  title: string
  description: string
  date: string
}

export interface LanguageItem {
  id: string
  language: string
  proficiency: string
}

export interface PublicationItem {
  id: string
  title: string
  publisher: string
  date: string
  link: string
}

export interface VolunteerItem {
  id: string
  organization: string
  role: string
  start: string
  end: string
  bullets: string[]
}

export interface ReferenceItem {
  id: string
  name: string
  position: string
  company: string
  email: string
  phone: string
}

export interface SummarySection {
  text: string
}

export interface InterestsSection {
  items: string[]
}

export interface ResumeData {
  version: number
  contact: Contact
  enabled_sections: SectionId[]
  section_order: SectionId[]
  summary: SummarySection
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: SkillGroup[]
  projects: ProjectItem[]
  certifications: CertificationItem[]
  achievements: AchievementItem[]
  languages: LanguageItem[]
  publications: PublicationItem[]
  volunteer: VolunteerItem[]
  interests: InterestsSection
  references: ReferenceItem[]
}
