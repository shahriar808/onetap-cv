import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ContactForm } from '../features/builder/sections/ContactForm'
import { BuilderLayout } from '../features/builder/components/BuilderLayout'
import { SectionPicker } from '../features/builder/components/SectionPicker'
import { Stepper, StepProgress } from '../features/builder/components/Stepper'
import { TemplatePicker } from '../features/builder/components/TemplatePicker'
import { PreviewPane } from '../features/builder/components/PreviewPane'
import { DownloadButton } from '../features/builder/components/DownloadButton'
import { ClearDataButton } from '../features/builder/components/ClearDataButton'
import { SECTION_REGISTRY } from '../features/builder/sections/registry'
import { useResumeStore } from '../store/resumeStore'
import { getHealth } from '../lib/api'

export function BuilderPage() {
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
  const enabledSections = useResumeStore((state) => state.data.enabled_sections)
  const sectionOrder = useResumeStore((state) => state.data.section_order)
  const registerDownload = useCallback((download: () => void) => {
    downloadAction.current = download
  }, [])

  useEffect(() => {
    document.title = 'Build your CV — OneTap CV'
  }, [])

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
    editor = (
      <section className="grid gap-4" aria-label="Resume section details">
        {detailSections.length === 0 ? (
          <Card>
            <div className="grid justify-items-start gap-3">
              <p className="text-slate-700">No optional sections yet.</p>
              <Button variant="secondary" onClick={() => changeStep(1)}>
                Go to Sections to add some
              </Button>
            </div>
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

  const editorFooter = (
    <footer className="grid justify-items-start gap-3 border-t border-slate-200 pt-4">
      <p className="max-w-2xl text-sm text-slate-600">
        Your data is saved only in this browser. It is sent to our server only
        to generate your preview and PDF, and is never stored.
      </p>
      <ClearDataButton
        onCleared={() => {
          setValidationRequest(0)
          changeStep(0)
        }}
      />
    </footer>
  )

  const serverNotice = serverStatus === 'down' ? (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950"
    >
      <p>
        Can&apos;t reach the server. Preview and download are unavailable.
      </p>
      <Button
        variant="secondary"
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
      className="mx-auto grid h-dvh min-h-0 max-w-7xl grid-rows-[auto_auto_minmax(0,1fr)] gap-3 overflow-hidden px-3 py-3 sm:px-5"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="text-lg font-bold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
        >
          OneTap CV
        </Link>
        <p className="text-sm text-slate-600">Your work saves automatically</p>
      </header>

      <StepProgress currentStep={currentStep} />

      <BuilderLayout
        editor={editor}
        preview={<PreviewPane data={data} template={template} />}
        stepper={<Stepper currentStep={currentStep} onStepChange={changeStep} />}
        notice={serverNotice}
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
