import { useEffect } from 'react'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
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
  useDocumentMeta({ title: 'OneTap CV: free ATS-friendly CV builder, no sign-up', description: 'Build a free ATS-friendly CV, preview the text, and download a searchable PDF. No account or watermark.', path: '/' })
  useEffect(() => {
    document.title = 'OneTap CV — Build an ATS-friendly CV'
  }, [])

  return (
    <main id="main-content" className="grid gap-12 sm:gap-16">
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'OneTap CV',
          description: 'A free ATS-friendly CV builder with searchable PDF downloads.',
          applicationCategory: 'BusinessApplication',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        })}
      </script>
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
