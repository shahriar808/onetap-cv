import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTemplates, type TemplateMetadata } from '../lib/api'
import { useResumeStore } from '../store/resumeStore'

const FALLBACK_TEMPLATES: TemplateMetadata[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'A traditional, polished resume layout.',
    best_for: 'Conservative industries and formal applications',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'A clean, contemporary design with clear hierarchy.',
    best_for: 'Most roles and industries',
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'A space-efficient design for dense experience.',
    best_for: 'Experienced candidates with more content',
  },
]

export function HomePage() {
  const fullName = useResumeStore((state) => state.data.contact.full_name)
  const [templates, setTemplates] = useState(FALLBACK_TEMPLATES)

  useEffect(() => {
    let active = true
    getTemplates()
      .then((result) => {
        if (active) {
          setTemplates(result)
        }
      })
      .catch(() => {
        if (active) {
          setTemplates(FALLBACK_TEMPLATES)
        }
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl content-start gap-12 px-5 py-12 sm:px-8">
      <header className="grid gap-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
          OneTap CV
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Build an ATS-friendly CV in minutes
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Create a clear, professional resume and download it as a searchable
          PDF.
        </p>
        <Link
          to="/build"
          className="mx-auto inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          {fullName.trim() ? 'Continue where you left off' : 'Build my CV'}
        </Link>
        <p className="text-sm text-slate-600">
          Your resume stays in this browser. No account required.
        </p>
      </header>

      <section aria-labelledby="template-preview-title" className="grid gap-5">
        <h2
          id="template-preview-title"
          className="text-center text-2xl font-semibold text-slate-900"
        >
          Choose from three professional designs
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {templates.map((template) => (
            <article
              key={template.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <img
                src={`/thumbnails/${template.id}.png`}
                alt={`${template.name} resume template preview`}
                className="aspect-[3/4] w-full bg-slate-100 object-contain"
              />
              <div className="grid gap-2 p-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {template.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {template.description}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Best for:</span>{' '}
                  {template.best_for}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
