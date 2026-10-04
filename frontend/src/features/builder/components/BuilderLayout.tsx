import type { ReactNode } from 'react'
import { MobileBar } from './MobileBar'

interface BuilderLayoutProps {
  editor: ReactNode
  preview: ReactNode
  activeTab: 'edit' | 'preview'
  onTabChange: (tab: 'edit' | 'preview') => void
  primaryLabel: string
  onPrimaryAction: () => void
}

export function BuilderLayout({
  editor,
  preview,
  activeTab,
  onTabChange,
  primaryLabel,
  onPrimaryAction,
}: BuilderLayoutProps) {
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div
        className={`min-w-0 lg:block lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto lg:pr-2 ${
          activeTab === 'edit' ? '' : 'hidden'
        }`}
      >
        {editor}
      </div>
      <div
        className={`min-w-0 lg:sticky lg:top-6 lg:block lg:self-start ${
          activeTab === 'preview' ? '' : 'hidden'
        }`}
      >
        {preview}
      </div>
      <MobileBar
        activeTab={activeTab}
        onTabChange={onTabChange}
        primaryLabel={primaryLabel}
        onPrimaryAction={onPrimaryAction}
      />
    </div>
  )
}
