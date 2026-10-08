import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  children: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink/90',
  secondary: 'border-ink bg-transparent text-ink hover:bg-paper-2',
  danger:
    'border-2 !border-danger bg-danger/10 text-danger hover:bg-danger/15',
  ghost: 'bg-transparent text-ink hover:underline hover:underline-offset-4',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    loading = false,
    disabled,
    children,
    className = '',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      {...props}
      type={props.type ?? 'button'}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2 text-base font-semibold transition active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}
      {children}
    </button>
  )
})
