import { CheckIcon } from '../../../components/icons'
import { LANDING_CONTENT } from '../content'

export function FactsStrip() {
  return (
    <section
      aria-label="CV facts"
      className="container-page border-y border-line py-6 sm:py-8"
    >
      <ul className="grid divide-y divide-line md:grid-cols-2 md:gap-x-8 md:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {LANDING_CONTENT.facts.map((fact) => (
          <li
            key={fact.label}
            className="grid grid-cols-[1rem_1fr] items-start gap-x-3 gap-y-2 py-4 first:pt-0 last:pb-0 md:py-3 md:first:pt-3 md:last:pb-3 lg:px-6 lg:first:pl-0 lg:last:pr-0"
          >
            <CheckIcon
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 text-moss"
            />
            <p className="text-label text-accent">{fact.label}</p>
            <p className="col-start-2 text-sm text-ink-soft">{fact.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
