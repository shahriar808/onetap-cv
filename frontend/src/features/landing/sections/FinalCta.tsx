import { Link } from 'react-router-dom'
import { LANDING_CONTENT } from '../content'

export function FinalCta() {
  return (
    <section className="bg-ink py-12 sm:py-16">
      <div className="container-page grid justify-items-start gap-5">
        <p className="text-label text-paper/70">12 / Start</p>
        <h2 className="max-w-3xl font-display text-display-xl font-semibold tracking-tight text-paper">
          {LANDING_CONTENT.finalCta.title}
        </h2>
        <Link
          to="/build"
          className="inline-flex min-h-12 items-center justify-center rounded-lg bg-paper px-6 py-3 font-semibold text-ink transition hover:-translate-y-px hover:bg-paper-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        >
          {LANDING_CONTENT.finalCta.button}
        </Link>
        <p className="text-sm text-paper/70">{LANDING_CONTENT.finalCta.note}</p>
      </div>
    </section>
  )
}
