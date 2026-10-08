import { SectionHeader } from '../../../components/ui/SectionHeader'
import { LANDING_CONTENT } from '../content'

export function Faq() {
  return (
    <section
      id="faq"
      className="container-page grid gap-8 py-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16 sm:py-12"
    >
      <div className="lg:sticky lg:top-24">
        <SectionHeader
          index={8}
          label="FAQ"
          title={LANDING_CONTENT.faq.title}
        />
      </div>
      <div className="divide-y divide-line border-y border-line">
        {LANDING_CONTENT.faq.items.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-ink marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                className="relative grid size-8 shrink-0 place-items-center rounded-full border border-line text-ink-muted transition-transform group-open:rotate-45 motion-reduce:transition-none"
              >
                <span className="absolute h-px w-3 bg-current" />
                <span className="absolute h-3 w-px bg-current" />
              </span>
            </summary>
            <p className="max-w-[62ch] pt-3 pr-10 text-ink-soft">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
