import { useState } from 'react'
import { ArrowRightIcon } from '../../../components/icons'
import { SectionHeader } from '../../../components/ui/SectionHeader'
import { LINKS } from '../../../content/links'
import { SocialRow, type SocialPlatform } from '../components/SocialRow'
import { LANDING_CONTENT } from '../content'

const SOCIAL_ROWS: {
  platform: SocialPlatform
  action: string
  accessibleName: string
}[] = [
  {
    platform: 'instagram',
    action: 'Follow on Instagram',
    accessibleName: 'Follow Shahriar on Instagram',
  },
  {
    platform: 'facebook',
    action: 'Follow on Facebook',
    accessibleName: 'Follow Shahriar on Facebook',
  },
  {
    platform: 'linkedin',
    action: 'Connect on LinkedIn',
    accessibleName: 'Connect with Shahriar on LinkedIn',
  },
  {
    platform: 'github',
    action: 'Follow on GitHub',
    accessibleName: 'Follow Shahriar on GitHub',
  },
]

export function Thanks() {
  const [portraitFailed, setPortraitFailed] = useState(false)

  return (
    <section
      id="thanks"
      className="container-page grid gap-8 py-8 sm:py-12 lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-16"
    >
      <div className="grid content-start justify-items-start gap-4">
        {portraitFailed ? (
          <div
            role="img"
            aria-label="Portrait placeholder for Shahriar Hasan"
            className="grid aspect-[4/5] w-full max-w-[220px] rotate-[-2deg] place-items-center rounded-[3px] bg-paper-2 font-display text-6xl font-semibold text-ink shadow-paper"
          >
            SH
          </div>
        ) : (
          <img
            src="/shahriar.jpg"
            alt="Shahriar Hasan"
            width={220}
            height={275}
            loading="lazy"
            decoding="async"
            onError={() => setPortraitFailed(true)}
            className="aspect-[4/5] w-full max-w-[220px] rotate-[-2deg] rounded-[3px] object-cover shadow-paper"
          />
        )}
        <p className="text-label text-ink-muted">
          {LANDING_CONTENT.thanks.location}
        </p>
      </div>
      <div className="grid min-w-0 content-start gap-6">
        <SectionHeader
          index={9}
          label="Thanks"
          title={LANDING_CONTENT.thanks.title}
        />
        <p className="max-w-[62ch] text-ink-soft">
          {LANDING_CONTENT.thanks.body}
        </p>
        <div className="border-b border-line">
          {SOCIAL_ROWS.map((row) => (
            <SocialRow key={row.platform} {...row} />
          ))}
        </div>
        <a
          href={LINKS.repo.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Star the project on GitHub (opens in a new tab)"
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg border border-line px-4 py-2 font-semibold text-ink transition-colors hover:bg-paper-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          {LANDING_CONTENT.thanks.githubAction}
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
