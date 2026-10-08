import type { HTMLAttributes, ReactNode } from 'react'

type BadgeVariant = 'moss' | 'ink'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: BadgeVariant
}

export function Badge({
  children,
  variant = 'ink',
  className = '',
  ...props
}: BadgeProps) {
  const variantClass =
    variant === 'moss' ? 'bg-moss text-white' : 'bg-ink text-paper'

  return (
    <span
      {...props}
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-label ${variantClass} ${className}`}
    >
      {children}
    </span>
  )
}
