import type { ComponentType } from 'react'
import {
  ArrowRightIcon,
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  type IconProps,
} from '../../../components/icons'
import { LINKS } from '../../../content/links'

export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'github'

const SOCIAL_ICONS: Record<SocialPlatform, ComponentType<IconProps>> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
}

interface SocialRowProps {
  platform: SocialPlatform
  action: string
  accessibleName: string
}

export function SocialRow({
  platform,
  action,
  accessibleName,
}: SocialRowProps) {
  const social = LINKS[platform]
  const Icon = SOCIAL_ICONS[platform]

  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${accessibleName} (opens in a new tab)`}
      className="group grid min-h-14 grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-3 border-t border-line px-2 py-2 text-ink transition-colors hover:bg-paper-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    >
      <Icon className="h-5 w-5 text-ink" />
      <span className="grid min-w-0 gap-0.5">
        <span className="font-semibold">{social.label}</span>
        <span className="truncate font-mono text-xs text-ink-muted">
          {social.handle}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2 text-xs font-medium text-ink-soft">
        <span>{action}</span>
        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </a>
  )
}
