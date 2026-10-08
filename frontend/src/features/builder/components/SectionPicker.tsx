import { Toggle } from '../../../components/ui/Toggle'
import { useResumeStore } from '../../../store/resumeStore'
import { SECTION_REGISTRY } from '../sections/registry'
import { LANDING_CONTENT } from '../../landing/content'

export function SectionPicker() {
  const enabledSections = useResumeStore((state) => state.data.enabled_sections)
  const toggleSection = useResumeStore((state) => state.toggleSection)

  return (
    <section aria-labelledby="section-picker-title" className="grid gap-6">
      <div>
        <h2
          id="section-picker-title"
          className="font-display text-display-md font-semibold text-ink"
        >
          {LANDING_CONTENT.builder.steps[1].title}
        </h2>
        <p className="mt-2 text-ink-soft">
          {LANDING_CONTENT.builder.steps[1].intro}
        </p>
      </div>
      <div className="grid divide-y divide-slate-200">
        {SECTION_REGISTRY.map((section) => (
          <Toggle
            key={section.id}
            label={section.label}
            description={section.description}
            checked={enabledSections.includes(section.id)}
            onChange={() => toggleSection(section.id)}
          />
        ))}
      </div>
    </section>
  )
}
