import { CheckIcon } from '../../../components/icons'
import { useResumeStore } from '../../../store/resumeStore'
import { SECTION_REGISTRY } from '../sections/registry'
import { LANDING_CONTENT } from '../../landing/content'

const tileClass =
  'relative grid min-h-32 grid-rows-[auto_1fr_auto] gap-3 rounded-xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

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
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <div
          role="group"
          aria-label="Contact details, always included"
          className={`${tileClass} border-ink bg-paper-2`}
        >
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-ink text-paper"
          >
            <CheckIcon size={16} />
          </span>
          <span className="pr-8 font-display text-lg font-semibold text-ink">
            Contact details
          </span>
          <span className="truncate text-sm text-ink-soft">
            Your contact information appears on every CV.
          </span>
          <span className="w-fit rounded-full bg-paper px-2 py-1 text-xs font-semibold text-ink-soft">
            Always included
          </span>
        </div>
        {SECTION_REGISTRY.map((section) => {
          const selected = enabledSections.includes(section.id)

          return (
            <button
              key={section.id}
              type="button"
              aria-label={section.label}
              aria-describedby={`section-${section.id}-description`}
              aria-pressed={selected}
              onClick={() => toggleSection(section.id)}
              className={`${tileClass} ${
                selected
                  ? 'border-ink bg-paper-2'
                  : 'border-line bg-paper hover:border-ink-soft'
              }`}
            >
              {selected && (
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-ink text-paper"
                >
                  <CheckIcon size={16} />
                </span>
              )}
              <span className="pr-8 font-display text-lg font-semibold text-ink">
                {section.label}
              </span>
              <span
                id={`section-${section.id}-description`}
                className="truncate text-sm text-ink-soft"
              >
                {section.description}
              </span>
              <span className="min-h-6">
                {section.defaultEnabled && (
                  <span className="inline-flex rounded-full bg-paper-2 px-2 py-1 text-xs font-semibold text-ink-soft">
                    Core
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
