import { Link } from 'react-router-dom'
import { SectionHeader } from '../components/ui/SectionHeader'

export function PrivacyPage() {
  return (
    <main id="main-content" className="container-page grid gap-10 py-12 sm:py-16">
      <SectionHeader
        index={1}
        label="Privacy"
        title="Your CV stays yours."
        lead="A short explanation of what happens to your information when you use OneTap CV."
      />
      <div className="grid max-w-3xl gap-6 text-ink-soft">
        <p>
          Your draft is saved in your own browser. OneTap CV does not require an
          account and does not store your CV on the server.
        </p>
        <p>
          When you preview or download, your CV is sent to our server only long
          enough to create the preview or PDF. It is not kept.
        </p>
        <p>
          Clearing your browser data or switching devices starts you fresh.
          Download your PDF once you are happy with it.
        </p>
        <p>
          If you send feedback, your message and any name or email you include
          are emailed to the owner. Feedback is not kept on OneTap CV&apos;s
          server.
        </p>
      </div>
      <Link
        to="/build"
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg bg-ink px-5 py-2 font-semibold text-paper hover:bg-ink/90"
      >
        Build my CV
      </Link>
    </main>
  )
}
