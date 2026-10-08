import type { HTMLAttributes, ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Reveal({ children, className = '', ...props }: RevealProps) {
  const { setElement, visible } = useReveal()
  return (
    <div
      {...props}
      ref={setElement}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  )
}
