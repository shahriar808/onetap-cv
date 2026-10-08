import { Link } from 'react-router-dom'
import { SectionHeader } from '../../../components/ui/SectionHeader'
import { LANDING_CONTENT } from '../content'

const SHEETS = {
  classic: 'landing-classic',
  modern: 'landing-modern',
  compact: 'landing-compact',
} as const

export function Designs() {
  return (
    <section id="designs" className="container-page grid gap-8 py-8 sm:py-12">
      <SectionHeader
        index={5}
        label="Designs"
        title={LANDING_CONTENT.designs.title}
      />
      <ul className="grid items-start gap-6 lg:grid-cols-[1fr_1.08fr_1fr]">
        {LANDING_CONTENT.designs.templates.map((template) => (
          <li
            key={template.id}
            className={`grid content-start gap-4 ${
              template.id === 'modern' ? 'lg:-mt-5' : ''
            }`}
          >
            <div className="grid aspect-[4/3] place-items-center overflow-hidden bg-desk p-6 sm:p-8">
              <img
                src={`/thumbnails/${SHEETS[template.id]}-480.webp`}
                srcSet={`/thumbnails/${SHEETS[template.id]}-480.webp 480w, /thumbnails/${SHEETS[template.id]}-900.webp 900w`}
                sizes="(max-width: 768px) 90vw, 360px"
                alt={`${template.name} CV design sample for Alex Rahman`}
                width={900}
                height={1272}
                loading="lazy"
                decoding="async"
                className="h-full max-h-80 w-auto border border-line bg-white object-contain shadow-paper transition-transform duration-200 hover:-translate-y-1"
              />
            </div>
            <div className="grid gap-2">
              <h3 className="font-display text-display-md font-semibold text-ink">
                {template.name}
              </h3>
              <p className="text-ink-soft">{template.description}</p>
              <div className="grid gap-1">
                <p className="text-label text-ink-muted">Best for</p>
                <p className="text-sm text-ink-soft">{template.bestFor}</p>
              </div>
              <Link
                to={`/build?template=${template.id}`}
                className="mt-2 inline-flex min-h-11 w-fit items-center justify-center rounded-lg border border-line px-4 py-2 font-semibold text-ink transition-colors hover:bg-paper-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                {template.action}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
