import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { LANDING_CONTENT } from './content'
import { useResumeStore } from '../../store/resumeStore'

const SECTIONS = [
  { id: 'top', label: 'Introduction', title: LANDING_CONTENT.hero.headline },
  { id: 'how', label: 'How it works', title: LANDING_CONTENT.how.title },
  { id: 'see', label: 'What the software sees', title: LANDING_CONTENT.parser.title },
  { id: 'designs', label: 'Designs', title: LANDING_CONTENT.designs.title },
  { id: 'sections', label: 'Sections included', title: LANDING_CONTENT.sections.title },
  { id: 'privacy', label: 'Privacy', title: LANDING_CONTENT.privacy.title },
  { id: 'faq', label: 'FAQ', title: LANDING_CONTENT.faq.title },
  { id: 'thanks', label: 'Thanks', title: LANDING_CONTENT.thanks.title },
  { id: 'feedback', label: 'Feedback', title: LANDING_CONTENT.feedback.title },
] as const

export function LandingPage() {
  const fullName = useResumeStore((state) => state.data.contact.full_name)

  useEffect(() => {
    document.title = 'OneTap CV — Build an ATS-friendly CV'
  }, [])

  return (
    <main id="main-content" className="container-page grid gap-12 py-12 sm:gap-16">
      <section id="top" className="grid gap-6 py-8">
        <SectionHeader
          index={1}
          label="Introduction"
          title={LANDING_CONTENT.hero.headline}
          lead={LANDING_CONTENT.hero.sub}
        />
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/build"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ink px-5 py-2 font-semibold text-paper hover:bg-ink/90"
          >
            {fullName.trim()
              ? LANDING_CONTENT.hero.returningPrimary
              : LANDING_CONTENT.hero.primary}
          </Link>
          <Link
            to="#designs"
            className="inline-flex min-h-11 items-center text-ink underline-offset-4 hover:underline"
          >
            {LANDING_CONTENT.hero.secondary}
          </Link>
        </div>
        {fullName.trim() && (
          <p className="text-sm text-ink-muted">
            {LANDING_CONTENT.hero.returningMessage}
          </p>
        )}
      </section>
      <section className="grid gap-5 border-y border-line py-8">
        <SectionHeader index={2} label="At a glance" title="Plain text. Clear layout." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LANDING_CONTENT.facts.map((fact) => (
            <div key={fact.label} className="grid content-start gap-2">
              <p className="text-label text-accent">{fact.label}</p>
              <p className="text-sm text-ink-soft">{fact.text}</p>
            </div>
          ))}
        </div>
      </section>
      {SECTIONS.slice(1).map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="grid gap-5 border-b border-line py-8"
        >
          <SectionHeader
            index={index + 3}
            label={section.label}
            title={section.title}
          />
          <p className="max-w-[62ch] text-ink-soft">
            {section.id === 'how' && LANDING_CONTENT.how.steps[0].text}
            {section.id === 'see' && LANDING_CONTENT.parser.sub}
            {section.id === 'designs' && LANDING_CONTENT.designs.templates[0].description}
            {section.id === 'sections' && LANDING_CONTENT.sections.sub}
            {section.id === 'privacy' && LANDING_CONTENT.privacy.footnote}
            {section.id === 'faq' && LANDING_CONTENT.faq.items[0].answer}
            {section.id === 'thanks' && LANDING_CONTENT.thanks.body}
            {section.id === 'feedback' && LANDING_CONTENT.feedback.sub}
          </p>
        </section>
      ))}
      <section className="grid gap-4 py-8">
        <SectionHeader index={12} label="Start" title={LANDING_CONTENT.finalCta.title} />
        <Link
          to="/build"
          className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg bg-ink px-5 py-2 font-semibold text-paper hover:bg-ink/90"
        >
          {LANDING_CONTENT.finalCta.button}
        </Link>
        <p className="text-sm text-ink-muted">{LANDING_CONTENT.finalCta.note}</p>
      </section>
    </main>
  )
}
