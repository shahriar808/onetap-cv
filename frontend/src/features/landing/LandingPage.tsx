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
import { Thanks } from './sections/Thanks'
import { Feedback } from './sections/Feedback'

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
      <Thanks />
      <Feedback />
      <FinalCta />
    </main>
  )
}
