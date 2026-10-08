import type { HTMLAttributes, ReactNode } from 'react'

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

export function Chip({ children, className = '', ...props }: ChipProps) {
  return (
    <span
      {...props}
      className={`inline-flex min-h-8 items-center rounded-full border border-line px-3 py-1 text-sm text-ink-soft ${className}`}
    >
      {children}
    </span>
  )
}
