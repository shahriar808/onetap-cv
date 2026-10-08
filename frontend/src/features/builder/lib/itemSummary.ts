import type { ResumeData, SectionId } from '../../../types/resume'

type ListSectionId = Exclude<SectionId, 'summary' | 'interests'>
type ListSectionItem = {
  [Id in ListSectionId]: ResumeData[Id][number]
}[ListSectionId]

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function formatDate(value: unknown): string {
  const date = text(value)
  const match = /^(\d{4})(?:-(\d{2}))?$/.exec(date)
  if (!match) {
    return date
  }
  if (!match[2]) {
    return match[1]
  }

  const month = Number(match[2])
  return month >= 1 && month <= 12
    ? `${MONTHS[month - 1]} ${match[1]}`
    : date
}

function dateRange(
  startValue: unknown,
  endValue: unknown,
  isCurrent = false,
): string {
  const start = formatDate(startValue)
  const end = isCurrent ? 'Present' : formatDate(endValue)
  if (start && end) {
    return `${start} – ${end}`
  }
  return start || end
}

function joinParts(...parts: string[]): string {
  return parts.filter(Boolean).join(' · ')
}

function summarize(sectionId: ListSectionId, item: ListSectionItem): string {
  switch (sectionId) {
    case 'experience':
      if ('is_current' in item) {
        return (
          dateRange(item.start, item.end, item.is_current) ||
          text(item.location) ||
          'Add dates or highlights'
        )
      }
      break
    case 'education':
      if ('degree' in item && 'field' in item) {
        return (
          joinParts(
            joinParts(text(item.degree), text(item.field)),
            dateRange(item.start, item.end),
          ) || 'Add education details'
        )
      }
      break
    case 'skills':
      if ('group_name' in item && 'items' in item) {
        const skills = Array.isArray(item.items)
          ? item.items
              .filter(
                (skill): skill is string =>
                  typeof skill === 'string' && skill.trim().length > 0,
              )
              .map((skill) => skill.trim())
          : []
        if (skills.length === 0) {
          return 'No skills added yet'
        }
        const visibleSkills = skills.slice(0, 3).join(', ')
        return skills.length > 3
          ? `${visibleSkills} +${skills.length - 3} more`
          : visibleSkills
      }
      break
    case 'projects':
      if ('tech_stack' in item) {
        return (
          text(item.tech_stack) ||
          dateRange(item.start, item.end) ||
          'Add tech stack or dates'
        )
      }
      break
    case 'certifications':
      if ('is_ongoing' in item) {
        return (
          joinParts(
            text(item.issuer),
            item.is_ongoing ? 'In progress' : formatDate(item.date),
          ) || 'Add issuer or date'
        )
      }
      break
    case 'achievements':
      if ('description' in item && 'date' in item) {
        return (
          formatDate(item.date) ||
          text(item.description) ||
          'Add achievement details'
        )
      }
      break
    case 'languages':
      if ('proficiency' in item) {
        return text(item.proficiency) || 'Add proficiency'
      }
      break
    case 'publications':
      if ('publisher' in item) {
        return (
          joinParts(text(item.publisher), formatDate(item.date)) ||
          'Add publisher or date'
        )
      }
      break
    case 'volunteer':
      if ('organization' in item && 'role' in item) {
        return (
          dateRange(item.start, item.end) || 'Add dates or highlights'
        )
      }
      break
    case 'references':
      if ('phone' in item && 'email' in item) {
        return (
          joinParts(text(item.position), text(item.company)) ||
          text(item.email) ||
          text(item.phone) ||
          'Add contact details'
        )
      }
      break
  }

  return 'Add details'
}

export function itemSummary<Id extends ListSectionId>(
  sectionId: Id,
  item: ResumeData[Id][number],
): string {
  return summarize(sectionId, item)
}
