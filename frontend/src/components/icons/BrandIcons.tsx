import type { ReactNode } from 'react'
import type { IconProps } from './IconBase'

function BrandIcon({
  children,
  className = '',
  size = 20,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
    >
      {children}
    </svg>
  )
}

export function InstagramIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2.4A2.6 2.6 0 0 0 4.4 7v10A2.6 2.6 0 0 0 7 19.6h10a2.6 2.6 0 0 0 2.6-2.6V7A2.6 2.6 0 0 0 17 4.4H7Z" />
      <path d="M12 7.1a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8Zm0 2.4a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm5.1-3.7a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
    </BrandIcon>
  )
}

export function FacebookIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M12 1.5A10.5 10.5 0 1 0 13.6 22v-7.9h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V4.7c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V11H7.7v3.1h2.7V22A10.5 10.5 0 0 0 12 1.5Z" />
    </BrandIcon>
  )
}

export function LinkedInIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2ZM7.9 18.7H4.8V9h3.1v9.7ZM6.3 7.7a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6Zm13 11h-3.1V14c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4v4.8H9.8V9h3v1.3h.1A3.3 3.3 0 0 1 15.8 8c3.1 0 3.6 2 3.6 4.6v6.1Z" />
    </BrandIcon>
  )
}

export function GitHubIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.3.8-.6v-2.1c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7 2.1 3.2 1.6a2.5 2.5 0 0 1 .7-1.6c-2.5-.3-5.1-1.3-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.5.1-3.1 0 0 .9-.3 3.1 1.1a10.8 10.8 0 0 1 5.6 0c2.1-1.4 3-1.1 3-1.1.6 1.6.2 2.8.1 3.1.7.8 1.1 1.8 1.1 3 0 4.2-2.6 5.2-5.1 5.5.4.4.7 1 .7 2.1v3.1c0 .3.2.7.8.6A11.1 11.1 0 0 0 12 .9Z" />
    </BrandIcon>
  )
}
