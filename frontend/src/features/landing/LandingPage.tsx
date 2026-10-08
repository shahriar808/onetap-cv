import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Hero } from './sections/Hero'
import { FactsStrip } from './sections/FactsStrip'
import { HowItWorks } from './sections/HowItWorks'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { LANDING_CONTENT } from './content'

const SECTIONS = [
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
  useEffect(() => {
    document.title = 'OneTap CV — Build an ATS-friendly CV'
  }, [])

  return (
    <main id="main-content" className="grid gap-12 sm:gap-16">
      <Hero />
      <FactsStrip />
      <HowItWorks />
      {SECTIONS.slice(1).map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="grid gap-5 border-b border-line py-8"
        >
          <SectionHeader
            index={index + 4}
            label={section.label}
            title={section.title}
          />
          <p className="max-w-[62ch] text-ink-soft">
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
