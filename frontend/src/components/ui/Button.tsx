import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  children: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-blue-700 text-white hover:bg-blue-800',
  secondary: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
  danger: 'bg-red-700 text-white hover:bg-red-800',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
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
      className={`inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {loading ? '…' : children}
    </button>
  )
})
