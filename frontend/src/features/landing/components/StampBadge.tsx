import { useId } from 'react'

interface StampBadgeProps {
  text: string
}

export function StampBadge({ text }: StampBadgeProps) {
  const pathId = `stamp-${useId().replaceAll(':', '')}`

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 96 96"
      className="absolute right-1 top-0 z-10 size-20 -rotate-12 text-accent sm:size-24"
    >
      <circle cx="48" cy="48" r="43" fill="var(--paper)" stroke="currentColor" strokeWidth="1.5" />
      <defs>
        <path id={pathId} d="M12 49a36 36 0 1 1 72 0a36 36 0 1 1-72 0" />
      </defs>
      <text
        fill="currentColor"
        fontFamily="var(--font-mono)"
        fontSize="7.5"
        fontWeight="700"
        letterSpacing="1"
      >
        <textPath href={`#${pathId}`} textLength="226" lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
      <circle cx="48" cy="48" r="2.5" fill="currentColor" />
    </svg>
  )
}
