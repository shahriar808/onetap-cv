import { useCallback, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ContactForm } from '../features/builder/sections/ContactForm'
import { BuilderLayout } from '../features/builder/components/BuilderLayout'
import { SectionPicker } from '../features/builder/components/SectionPicker'
import { Stepper } from '../features/builder/components/Stepper'
import { TemplatePicker } from '../features/builder/components/TemplatePicker'
import { PreviewPane } from '../features/builder/components/PreviewPane'
import { DownloadButton } from '../features/builder/components/DownloadButton'
import { SECTION_REGISTRY } from '../features/builder/sections/registry'
import { useResumeStore } from '../store/resumeStore'

export function BuilderPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [validationRequest, setValidationRequest] = useState(0)
  const downloadAction = useRef<() => void>(() => {})
  const data = useResumeStore((state) => state.data)
  const template = useResumeStore((state) => state.selectedTemplate)
  const enabledSections = useResumeStore((state) => state.data.enabled_sections)
  const sectionOrder = useResumeStore((state) => state.data.section_order)
  const registerDownload = useCallback((download: () => void) => {
    downloadAction.current = download
  }, [])

  function changeStep(step: number) {
    setCurrentStep(step)
    setActiveTab('edit')
  }

  function goNext() {
    if (currentStep === 3) {
      setActiveTab('edit')
      downloadAction.current()
    } else {
      changeStep(currentStep + 1)
    }
  }

  const detailSections = sectionOrder
    .filter((sectionId) => enabledSections.includes(sectionId))
    .map((sectionId) =>
      SECTION_REGISTRY.find((section) => section.id === sectionId),
    )
    .filter((section) => section !== undefined)

  let editor: ReactNode
  if (currentStep === 0) {
    editor = <ContactForm validationRequest={validationRequest} />
  } else if (currentStep === 1) {
    editor = <SectionPicker />
  } else if (currentStep === 2) {
    editor = (
      <section className="grid gap-4" aria-label="Resume section details">
        {detailSections.length === 0 ? (
          <Card>
            <p className="text-slate-700">
              No sections selected. Go back to choose the sections you want to
              include.
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
    )
  } else {
    editor = (
      <Card>
        <TemplatePicker />
        <div className="mt-5">
          <DownloadButton
            onValidationRequested={() =>
              setValidationRequest((request) => request + 1)
            }
            onGoToContact={() => changeStep(0)}
            onRegisterDownload={registerDownload}
          />
        </div>
      </Card>
    )
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl content-start gap-6 px-4 py-6 pb-40 sm:px-6 lg:pb-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="text-lg font-bold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
        >
          OneTap CV
        </Link>
        <p className="text-sm text-slate-600">Your work saves automatically</p>
      </header>

      <Stepper currentStep={currentStep} onStepChange={changeStep} />

      <BuilderLayout
        editor={editor}
        preview={<PreviewPane data={data} template={template} />}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        primaryLabel={currentStep === 3 ? 'Download' : 'Next'}
        onPrimaryAction={goNext}
      />

      <nav
        aria-label="Step navigation"
        className="hidden justify-between gap-3 lg:flex"
      >
        <Button
          variant="secondary"
          disabled={currentStep === 0}
          onClick={() => changeStep(Math.max(0, currentStep - 1))}
        >
          Previous
        </Button>
        <Button
          disabled={currentStep === 3}
          onClick={() => changeStep(Math.min(3, currentStep + 1))}
        >
          Next
        </Button>
      </nav>
    </main>
  )
}
