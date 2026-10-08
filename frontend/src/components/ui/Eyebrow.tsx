import type { HTMLAttributes, ReactNode } from 'react'

interface EyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export function Eyebrow({
  children,
  className = '',
  ...props
}: EyebrowProps) {
  return (
    <p {...props} className={`text-label text-ink-muted ${className}`}>
      {children}
    </p>
  )
}
