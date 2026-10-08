import { Link } from 'react-router-dom'
import { ArrowDownIcon, ArrowRightIcon } from '../../../components/icons'
import { SectionHeader } from '../../../components/ui/SectionHeader'
import { LANDING_CONTENT } from '../content'

export function PrivacyExplainer() {
  return (
    <section
      id="privacy"
      className="container-page grid gap-8 py-8 sm:py-12"
    >
      <SectionHeader
        index={7}
        label="Privacy"
        title={LANDING_CONTENT.privacy.title}
      />
      <ol className="grid gap-8 lg:grid-cols-3 lg:gap-14">
        {LANDING_CONTENT.privacy.steps.map((step, index) => (
          <li key={step.label} className="relative grid content-start gap-3">
            <div className="flex items-center gap-3">
              <p className="text-label text-ink-muted">{step.label}</p>
              {index === 1 && (
                <span className="rounded-full bg-moss/10 px-2.5 py-1 text-xs font-semibold text-moss">
                  Not stored
                </span>
              )}
            </div>
            <h3 className="font-display text-display-md font-semibold text-ink">
              {step.title}
            </h3>
            <p className="max-w-[42ch] text-sm text-ink-soft">{step.text}</p>
            {index < LANDING_CONTENT.privacy.steps.length - 1 && (
              <>
                <ArrowDownIcon className="absolute -bottom-7 left-0 text-ink-muted lg:hidden" />
                <ArrowRightIcon className="absolute -right-10 top-1/2 hidden -translate-y-1/2 text-ink-muted lg:block" />
              </>
            )}
          </li>
        ))}
      </ol>
      <p className="max-w-[62ch] text-sm text-ink-muted">
        {LANDING_CONTENT.privacy.footnote}
      </p>
      <Link
        to="/privacy"
        className="inline-flex min-h-11 w-fit items-center font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        Read the privacy policy
      </Link>
    </section>
  )
}
