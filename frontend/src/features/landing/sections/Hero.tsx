import { Link } from 'react-router-dom'
import { useResumeStore } from '../../../store/resumeStore'
import { LANDING_CONTENT } from '../content'
import { HandUnderline } from '../components/HandUnderline'
import { SheetFan } from '../components/SheetFan'
import { StampBadge } from '../components/StampBadge'

export function Hero() {
  const fullName = useResumeStore((state) => state.data.contact.full_name)
  const headline = LANDING_CONTENT.hero.headline
  const [before, after] = headline.split(LANDING_CONTENT.hero.underlinedPhrase)
  const following = after?.startsWith(',') ? after.slice(1) : after

  return (
    <section
      id="top"
      className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-8 lg:py-20"
    >
      <div className="grid min-w-0 content-center justify-items-start gap-6">
        <p className="text-label text-accent">
          {LANDING_CONTENT.hero.eyebrow}
        </p>
        <h1 className="max-w-3xl font-display text-display-xl font-semibold tracking-tight text-ink">
          {before}
          <HandUnderline>
            {LANDING_CONTENT.hero.underlinedPhrase},
          </HandUnderline>
          {following}
        </h1>
        <p className="max-w-[52ch] text-lead text-ink-soft">
          {LANDING_CONTENT.hero.sub}
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            to="/build"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-ink px-6 py-3 font-semibold text-paper transition hover:-translate-y-px hover:bg-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {fullName.trim()
              ? LANDING_CONTENT.hero.returningPrimary
              : LANDING_CONTENT.hero.primary}
          </Link>
          <Link
            to="/#designs"
            className="inline-flex min-h-12 items-center justify-center px-4 py-3 font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            {LANDING_CONTENT.hero.secondary}
          </Link>
        </div>
        {fullName.trim() && (
          <p className="text-sm text-ink-muted">
            {LANDING_CONTENT.hero.returningMessage}
          </p>
        )}
      </div>
      <div className="relative mx-auto min-w-0 w-full max-w-[480px] lg:max-w-none">
        <SheetFan />
        <StampBadge text={LANDING_CONTENT.hero.stamp} />
      </div>
    </section>
  )
}
