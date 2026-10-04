import type { ReactNode } from 'react'

interface BuilderLayoutProps {
  editor: ReactNode
  preview: ReactNode
}

export function BuilderLayout({ editor, preview }: BuilderLayoutProps) {
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto lg:pr-2">
        {editor}
      </div>
      <div className="min-w-0 lg:sticky lg:top-6 lg:self-start">{preview}</div>
    </div>
  )
}
