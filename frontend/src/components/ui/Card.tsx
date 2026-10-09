import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

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
      className={cn('rounded-md border border-line bg-paper-2 p-4', elevated && 'shadow-paper', className)}
    >
      {children}
    </div>
  )
}
