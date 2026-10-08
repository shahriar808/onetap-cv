import type { ReactNode } from 'react'

interface HandUnderlineProps {
  children: ReactNode
}

export function HandUnderline({ children }: HandUnderlineProps) {
  return (
    <span className="hand-underline relative">
      {children}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 220 14"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-1 left-0 h-3 w-full overflow-visible text-accent"
      >
        <path
          d="M2 10C46 4 73 12 111 7s74-1 107-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="hand-underline-path"
        />
      </svg>
    </span>
  )
}
