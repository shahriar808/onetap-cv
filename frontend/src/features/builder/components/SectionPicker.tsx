import { Toggle } from '../../../components/ui/Toggle'
import { useResumeStore } from '../../../store/resumeStore'
import { SECTION_REGISTRY } from '../sections/registry'

export function SectionPicker() {
  const enabledSections = useResumeStore((state) => state.data.enabled_sections)
  const toggleSection = useResumeStore((state) => state.toggleSection)

  return (
    <section aria-labelledby="section-picker-title" className="grid gap-4">
      <div>
        <h2 id="section-picker-title" className="text-xl font-semibold">
          Choose your sections
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Turn sections on or off. You can change this later.
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
