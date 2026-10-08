import { CheckIcon } from '../../../components/icons'
import { SectionHeader } from '../../../components/ui/SectionHeader'
import { SECTION_REGISTRY } from '../../builder/sections/registry'
import { LANDING_CONTENT } from '../content'

export function SectionsIncluded() {
  return (
    <section
      id="sections"
      className="container-page grid gap-8 py-8 lg:grid-cols-2 lg:items-start lg:gap-16 sm:py-12"
    >
      <SectionHeader
        index={6}
        label="Sections included"
        title={LANDING_CONTENT.sections.title}
        lead={LANDING_CONTENT.sections.sub}
      />
      <div className="grid content-start gap-5">
        <ul
          aria-label="Available CV sections"
          className="flex flex-wrap gap-2"
        >
          {SECTION_REGISTRY.map((section) => (
            <li
              key={section.id}
              className="rounded-full border border-line px-3 py-1.5 text-sm text-ink-soft"
            >
              {section.label}
            </li>
          ))}
        </ul>
        <p className="flex items-start gap-2 text-sm font-medium text-moss">
          <CheckIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {LANDING_CONTENT.sections.alwaysIncluded}
        </p>
      </div>
    </section>
  )
}
