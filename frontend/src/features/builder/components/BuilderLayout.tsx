import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { Button } from '../../../components/ui/Button'
import { MobileBar } from './MobileBar'

interface BuilderLayoutProps {
  editor: ReactNode
  stepIndex: number
  preview: ReactNode
  stepper: ReactNode
  editorFooter: ReactNode
  activeTab: 'edit' | 'preview'
  onTabChange: (tab: 'edit' | 'preview') => void
  previousDisabled: boolean
  onPrevious: () => void
  primaryLabel: string
  onPrimaryAction: () => void
}

export function BuilderLayout({
  editor,
  stepIndex,
  preview,
  stepper,
  editorFooter,
  activeTab,
  onTabChange,
  previousDisabled,
  onPrevious,
  primaryLabel,
  onPrimaryAction,
}: BuilderLayoutProps) {
  const editorScrollRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (editorScrollRef.current) editorScrollRef.current.scrollTop = 0
  }, [stepIndex])

  return (
    <div className="grid h-full min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
      <div>{stepper}</div>
      <div className="grid min-h-0 min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
        <section
          aria-label="Resume editor"
          className={`flex min-h-0 min-w-0 flex-col lg:flex ${
            activeTab === 'edit' ? '' : 'hidden'
          }`}
        >
          <div ref={editorScrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-4 lg:pr-3">
            <div className="grid content-start gap-5">
              <div key={stepIndex} className="builder-step-enter">
                {editor}
              </div>
              {editorFooter}
            </div>
          </div>
          <nav
            aria-label="Step navigation"
            className="hidden shrink-0 items-center justify-between border-t border-line bg-paper px-2 py-3 lg:flex"
          >
            <Button
              variant="secondary"
              disabled={previousDisabled}
              onClick={onPrevious}
            >
              Previous
            </Button>
            <Button onClick={onPrimaryAction}>{primaryLabel}</Button>
          </nav>
        </section>
        <section
          aria-label="CV preview panel"
          className={`min-h-0 min-w-0 overflow-y-auto overscroll-contain pb-[calc(6rem+env(safe-area-inset-bottom))] lg:block lg:pb-4 lg:pr-1 ${
            activeTab === 'preview' ? '' : 'hidden'
          }`}
        >
          {preview}
        </section>
      </div>
      <MobileBar
        activeTab={activeTab}
        onTabChange={onTabChange}
        previousDisabled={previousDisabled}
        onPrevious={onPrevious}
        primaryLabel={primaryLabel}
        onPrimaryAction={onPrimaryAction}
      />
    </div>
  )
}
