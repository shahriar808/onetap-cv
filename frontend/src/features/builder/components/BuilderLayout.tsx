import type { ReactNode } from 'react'
import { Button } from '../../../components/ui/Button'
import { MobileBar } from './MobileBar'

interface BuilderLayoutProps {
  editor: ReactNode
  preview: ReactNode
  stepper: ReactNode
  notice: ReactNode
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
  preview,
  stepper,
  notice,
  editorFooter,
  activeTab,
  onTabChange,
  previousDisabled,
  onPrevious,
  primaryLabel,
  onPrimaryAction,
}: BuilderLayoutProps) {
  return (
    <div className="grid h-full min-h-0 min-w-0 grid-cols-1 gap-4 lg:grid-cols-[12rem_minmax(0,1fr)_minmax(0,1fr)] lg:gap-5">
      <aside className="hidden min-h-0 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 lg:block">
        {stepper}
      </aside>
      <section
        aria-label="Resume editor"
        className={`flex min-h-0 min-w-0 flex-col lg:flex ${
          activeTab === 'edit' ? '' : 'hidden'
        }`}
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-24 lg:pb-4 lg:pr-2">
          <div className="grid content-start gap-5">
            {notice}
            {editor}
            {editorFooter}
          </div>
        </div>
        <nav
          aria-label="Step navigation"
          className="hidden shrink-0 items-center justify-between border-t border-slate-200 bg-white py-3 lg:flex"
        >
          <Button
            variant="secondary"
            disabled={previousDisabled}
            onClick={onPrevious}
          >
            Previous
          </Button>
          <Button
            onClick={onPrimaryAction}
          >
            {primaryLabel}
          </Button>
        </nav>
      </section>
      <section
        aria-label="CV preview panel"
        className={`min-h-0 min-w-0 overflow-y-auto overscroll-contain pb-24 lg:block lg:pb-4 lg:pr-1 ${
          activeTab === 'preview' ? '' : 'hidden'
        }`}
      >
        {preview}
      </section>
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
