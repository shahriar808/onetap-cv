import type { ReactNode } from 'react'
import { Eyebrow } from './Eyebrow'

interface SectionHeaderProps {
  index: number | string
  label: string
  title: string
  lead?: ReactNode
}

export function SectionHeader({
  index,
  label,
  title,
  lead,
}: SectionHeaderProps) {
  const sectionIndex = String(index).padStart(2, '0')

  return (
    <header className="grid gap-4">
      <div className="flex items-center gap-3">
        <Eyebrow className="shrink-0 text-accent">
          {sectionIndex} / {label}
        </Eyebrow>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </div>
      <div className="grid gap-2">
        <h2 className="max-w-3xl text-display-lg font-semibold tracking-tight text-ink">
          {title}
        </h2>
        {lead && <p className="max-w-[62ch] text-lead text-ink-soft">{lead}</p>}
      </div>
    </header>
  )
}
