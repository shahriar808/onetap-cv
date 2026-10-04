import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ContactForm } from '../features/builder/sections/ContactForm'
import { SectionPicker } from '../features/builder/components/SectionPicker'
import { Stepper } from '../features/builder/components/Stepper'
import { SECTION_REGISTRY } from '../features/builder/sections/registry'
import { useResumeStore } from '../store/resumeStore'

export function BuilderPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const enabledSections = useResumeStore((state) => state.data.enabled_sections)
  const sectionOrder = useResumeStore((state) => state.data.section_order)

  const detailSections = sectionOrder
    .filter((sectionId) => enabledSections.includes(sectionId))
    .map((sectionId) =>
      SECTION_REGISTRY.find((section) => section.id === sectionId),
    )
    .filter((section) => section !== undefined)

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl content-start gap-6 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="text-lg font-bold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
        >
          OneTap CV
        </Link>
        <p className="text-sm text-slate-600">Your work saves automatically</p>
      </header>

      <Stepper currentStep={currentStep} onStepChange={setCurrentStep} />

      <div className="grid gap-5">
        {currentStep === 0 && <ContactForm />}
        {currentStep === 1 && <SectionPicker />}
        {currentStep === 2 && (
          <section className="grid gap-4" aria-label="Resume section details">
            {detailSections.length === 0 ? (
              <Card>
                <p className="text-slate-700">
                  No sections selected. Go back to choose the sections you want
                  to include.
                </p>
              </Card>
            ) : (
              detailSections.map((section) => (
                <Card key={section.id} className="grid gap-4">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {section.label}
                  </h2>
                  <section.Form />
                </Card>
              ))
            )}
          </section>
        )}
        {currentStep === 3 && (
          <Card>
            <h2 className="text-xl font-semibold text-slate-900">
              Template &amp; Download
            </h2>
            <p className="mt-2 text-slate-600">
              Choose a design and download your finished CV.
            </p>
          </Card>
        )}
      </div>

      <nav aria-label="Step navigation" className="flex justify-between gap-3">
        <Button
          variant="secondary"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
        >
          Previous
        </Button>
        <Button
          disabled={currentStep === 3}
          onClick={() => setCurrentStep((step) => Math.min(3, step + 1))}
        >
          Next
        </Button>
      </nav>
    </main>
  )
}
