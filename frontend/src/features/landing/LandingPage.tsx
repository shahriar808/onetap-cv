import { useEffect } from 'react'
import { Hero } from './sections/Hero'
import { FactsStrip } from './sections/FactsStrip'
import { HowItWorks } from './sections/HowItWorks'
import { ParserDemo } from './sections/ParserDemo'
import { Designs } from './sections/Designs'
import { SectionsIncluded } from './sections/SectionsIncluded'
import { PrivacyExplainer } from './sections/PrivacyExplainer'
import { Faq } from './sections/Faq'
import { FinalCta } from './sections/FinalCta'
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
      <ParserDemo />
      <Designs />
      <SectionsIncluded />
      <PrivacyExplainer />
      <Faq />
      {SECTIONS.slice(6).map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="grid gap-5 border-b border-line py-8"
        >
          <SectionHeader
            index={index + 9}
            label={section.label}
            title={section.title}
          />
          <p className="max-w-[62ch] text-ink-soft">
            {section.id === 'thanks' && LANDING_CONTENT.thanks.body}
            {section.id === 'feedback' && LANDING_CONTENT.feedback.sub}
          </p>
        </section>
      ))}
      <FinalCta />
    </main>
  )
}
