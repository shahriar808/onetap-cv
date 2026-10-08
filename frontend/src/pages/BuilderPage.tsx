import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ContactForm } from '../features/builder/sections/ContactForm'
import { AppBar } from '../features/builder/components/AppBar'
import { BuilderLayout } from '../features/builder/components/BuilderLayout'
import { SectionPicker } from '../features/builder/components/SectionPicker'
import { Stepper, StepProgress } from '../features/builder/components/Stepper'
import { TemplatePicker } from '../features/builder/components/TemplatePicker'
import { PreviewPane } from '../features/builder/components/PreviewPane'
import { DownloadButton } from '../features/builder/components/DownloadButton'
import { EmptySectionsState } from '../features/builder/components/EmptySectionsState'
import { AlertTriangleIcon } from '../components/icons'
import { SECTION_REGISTRY } from '../features/builder/sections/registry'
import { useResumeStore } from '../store/resumeStore'
import type { TemplateId } from '../lib/defaults'
import { getHealth } from '../lib/api'
import { LANDING_CONTENT } from '../features/landing/content'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const TEMPLATE_IDS: readonly TemplateId[] = ['classic', 'modern', 'compact']

function isTemplateId(value: string): value is TemplateId {
  return TEMPLATE_IDS.some((templateId) => templateId === value)
}

export function BuilderPage() {
  useDocumentMeta({ title: 'Build your CV | OneTap CV', description: 'Build and download your ATS-friendly CV with OneTap CV.', path: '/build' })
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [validationRequest, setValidationRequest] = useState(0)
  const [serverStatus, setServerStatus] = useState<'checking' | 'ok' | 'down'>(
    'checking',
  )
  const [healthRetry, setHealthRetry] = useState(0)
  const downloadAction = useRef<() => void>(() => {})
  const data = useResumeStore((state) => state.data)
  const template = useResumeStore((state) => state.selectedTemplate)
  const setTemplate = useResumeStore((state) => state.setTemplate)
  const enabledSections = useResumeStore((state) => state.data.enabled_sections)
  const sectionOrder = useResumeStore((state) => state.data.section_order)
  const registerDownload = useCallback((download: () => void) => {
    downloadAction.current = download
  }, [])

  useEffect(() => {
    document.title = 'Build your CV — OneTap CV'
  }, [])

  useEffect(() => {
    const requestedTemplate = searchParams.get('template')
    if (requestedTemplate === null) {
      return
    }

    if (isTemplateId(requestedTemplate)) {
      setTemplate(requestedTemplate)
    }

    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('template')
    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams, setTemplate])

  useEffect(() => {
    let active = true
    getHealth()
      .then(({ status }) => {
        if (active) {
          setServerStatus(status === 'ok' ? 'ok' : 'down')
        }
      })
      .catch(() => {
        if (active) {
          setServerStatus('down')
        }
      })
    return () => {
      active = false
    }
  }, [healthRetry])

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
    const step = LANDING_CONTENT.builder.steps[2]
    editor = (
      <section className="grid gap-6" aria-label="Resume section details">
        <header className="grid gap-2">
          <h2 className="font-display text-display-md font-semibold text-ink">
            {step.title}
          </h2>
          <p className="text-ink-soft">{step.intro}</p>
        </header>
        {detailSections.length === 0 ? (
          <EmptySectionsState onChooseSections={() => changeStep(1)} />
        ) : (
          detailSections.map((section) => (
            <Card key={section.id} className="grid gap-4">
              <div className="grid gap-1">
                <h3 className="font-display text-display-sm font-semibold text-ink">
                  {section.label}
                </h3>
                <p className="text-sm text-ink-soft">{section.description}</p>
              </div>
              <section.Form />
            </Card>
          ))
        )}
      </section>
    )
  } else {
    const step = LANDING_CONTENT.builder.steps[3]
    editor = (
      <div className="grid content-start gap-6">
        <header className="grid gap-2">
          <h2 className="font-display text-display-md font-semibold text-ink">
            {step.title}
          </h2>
          <p className="text-ink-soft">{step.intro}</p>
        </header>
        <Card className="grid gap-5">
          <TemplatePicker />
          <DownloadButton
            onValidationRequested={() =>
              setValidationRequest((request) => request + 1)
            }
            onGoToContact={() => changeStep(0)}
            onRegisterDownload={registerDownload}
          />
        </Card>
      </div>
    )
  }

  const editorFooter = (
    <footer className="grid justify-items-start gap-3 border-t border-slate-200 pt-4">
      <p className="max-w-2xl text-sm text-slate-600">
        Your data is saved only in this browser. It is sent to our server only
        to generate your preview and PDF, and is never stored.
      </p>
    </footer>
  )

  const serverNotice = serverStatus === 'down' ? (
    <div
      role="alert"
      className="flex min-h-11 flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-ink"
    >
      <p className="flex items-center gap-2">
        <AlertTriangleIcon className="shrink-0 text-danger" size={18} />
        Can&apos;t reach the server. Preview and download are unavailable.
      </p>
      <Button
        variant="secondary"
        className="min-h-9 px-3 py-1 text-sm"
        onClick={() => {
          setServerStatus('checking')
          setHealthRetry((retry) => retry + 1)
        }}
      >
        Retry connection
      </Button>
    </div>
  ) : null

  return (
    <main
      id="main-content"
      className="mx-auto grid h-dvh min-h-0 max-w-7xl grid-rows-[auto_auto_auto_minmax(0,1fr)] gap-3 overflow-hidden px-3 py-3 sm:px-5"
    >
      <AppBar
        onCleared={() => {
          setValidationRequest(0)
          changeStep(0)
        }}
      />

      {serverNotice}
      <StepProgress currentStep={currentStep} />

      <BuilderLayout
        editor={editor}
        stepIndex={currentStep}
        preview={<PreviewPane data={data} template={template} />}
        stepper={<Stepper currentStep={currentStep} onStepChange={changeStep} />}
        editorFooter={editorFooter}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        previousDisabled={currentStep === 0}
        onPrevious={() => changeStep(Math.max(0, currentStep - 1))}
        primaryLabel={currentStep === 3 ? 'Download' : 'Next'}
        onPrimaryAction={goNext}
      />
    </main>
  )
}
