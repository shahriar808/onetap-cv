import { Link } from 'react-router-dom'

interface WordmarkProps {
  size?: number
  showText?: boolean
}

export function Wordmark({ size = 24, showText = true }: WordmarkProps) {
  return (
    <Link
      to="/"
      aria-label="OneTap CV home"
      className="inline-flex min-h-11 items-center gap-2 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        className="shrink-0"
      >
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="12" cy="12" r="2.5" className="fill-accent" />
      </svg>
      {showText && (
        <span className="font-display text-xl font-semibold leading-none">
          OneTap CV
        </span>
      )}
    </Link>
  )
}
