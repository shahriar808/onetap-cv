import { SECTION_REGISTRY } from '../../builder/sections/registry'
import { SectionHeader } from '../../../components/ui/SectionHeader'
import { LANDING_CONTENT } from '../content'

function SectionChips() {
  return (
    <ul
      aria-hidden="true"
      className="mt-4 flex flex-wrap gap-2"
    >
      {SECTION_REGISTRY.map((section) => (
        <li
          key={section.id}
          className={`rounded-full border px-2.5 py-1 text-xs ${
            section.defaultEnabled
              ? 'border-moss/30 bg-moss/10 text-moss'
              : 'border-line text-ink-muted'
          }`}
        >
          {section.label}
        </li>
      ))}
    </ul>
  )
}

function EditPreviewMock() {
  return (
    <div
      aria-hidden="true"
      className="mt-4 inline-grid min-h-10 grid-cols-2 rounded-lg border border-line bg-paper-2 p-1 text-sm"
    >
      <span className="grid min-h-8 place-items-center rounded-md bg-paper px-4 font-semibold text-ink shadow-sm">
        {LANDING_CONTENT.how.editLabel}
      </span>
      <span className="grid min-h-8 place-items-center px-4 text-ink-muted">
        {LANDING_CONTENT.how.previewLabel}
      </span>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section id="how" className="container-page grid gap-10 py-8 sm:py-12">
      <SectionHeader
        index={3}
        label="How it works"
        title={LANDING_CONTENT.how.title}
      />
      <ol       className="relative grid gap-12 before:absolute before:bottom-8 before:left-[2.625rem] before:top-8 before:w-px before:bg-line lg:gap-16 lg:before:left-1/2">
        {LANDING_CONTENT.how.steps.map((step, index) => (
          <li
            key={step.title}
            className="relative grid grid-cols-[5.25rem_minmax(0,1fr)] gap-x-4 lg:grid-cols-2 lg:gap-x-16"
          >
            <span
              aria-hidden="true"
              className={`col-start-1 row-start-1 font-display text-display-xl font-semibold leading-none text-ink/20 lg:row-auto ${
                index === 1
                  ? 'lg:col-start-2 lg:justify-self-start'
                  : 'lg:col-start-1 lg:justify-self-end'
              }`}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div
              className={`col-start-2 row-start-1 min-w-0 ${
                index === 1
                  ? 'lg:col-start-1 lg:row-start-1 lg:text-right'
                  : 'lg:col-start-2 lg:row-start-1'
              }`}
            >
              <h3 className="font-display text-display-md font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[52ch] text-ink-soft lg:ml-0">
                {step.text}
              </p>
              {index === 2 && <EditPreviewMock />}
            </div>
            {index === 1 && (
              <div className="col-span-2 row-start-2 lg:col-start-1 lg:col-span-1 lg:justify-self-end">
                <SectionChips />
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
