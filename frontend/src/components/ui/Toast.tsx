import { Button } from './Button'

interface ToastProps {
  message: string
  onDismiss: () => void
}

export function Toast({ message, onDismiss }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-14 items-center gap-4 rounded-lg border border-line bg-ink px-4 py-2 text-paper shadow-paper"
    >
      <p className="flex-1">{message}</p>
      <Button
        variant="ghost"
        className="min-h-11 px-3 text-paper hover:text-paper"
        aria-label="Dismiss notification"
        onClick={onDismiss}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </Button>
    </div>
  )
}
