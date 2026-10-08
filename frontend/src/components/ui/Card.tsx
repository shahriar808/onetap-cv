import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  elevated?: boolean
}

export function Card({
  children,
  elevated = false,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-md border border-line bg-paper-2 p-4 ${
        elevated ? 'shadow-paper' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
