import type { ReactNode } from 'react'

export interface IconProps {
  className?: string
  size?: number
  strokeWidth?: number
}

interface IconBaseProps extends IconProps {
  children: ReactNode
}

export function IconBase({ children, className = '', size = 20, strokeWidth = 1.75 }: IconBaseProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}
