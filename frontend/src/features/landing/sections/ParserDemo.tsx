import { useRef, useState, type KeyboardEvent } from 'react'
import { SectionHeader } from '../../../components/ui/SectionHeader'
import { LANDING_CONTENT } from '../content'
import { PARSER_DEMO_DATA } from '../components/ParserDemoData'

const TABS = [
  { id: 'two-column', label: LANDING_CONTENT.parser.twoColumnLabel },
  { id: 'one-tap', label: LANDING_CONTENT.parser.oneTapLabel },
] as const

type DemoTab = (typeof TABS)[number]['id']

function PageMock({ activeTab }: { activeTab: DemoTab }) {
  const isTwoColumn = activeTab === 'two-column'
  const sections = isTwoColumn
    ? [['Skills', 'Example skill · Another skill'], ['Languages', 'Example language'], ['Experience', 'Example role', 'Example project'], ['Education', 'Example qualification']]
    : [['Skills', 'Example skill · Another skill'], ['Experience', 'Example role · Example project'], ['Education', 'Example qualification']]

  return (
    <div role="img" aria-label="Illustration of a sample CV page" className="relative min-h-64 overflow-hidden rounded-sm border border-line bg-white p-5 shadow-paper sm:p-7">
      <p className="border-b border-line pb-3 font-display text-lg font-semibold text-ink">Shahriar Hasan</p>
      <p className="mt-2 border-b border-line pb-3 text-xs text-ink-muted">Sample CV</p>
      <div className={`relative mt-5 ${isTwoColumn ? 'grid grid-cols-2 gap-4' : 'space-y-3 border-l-2 border-accent pl-4'}`}>
        {sections.map(([heading, ...details], index) => (
          <div key={heading} className={`space-y-1 ${isTwoColumn && index % 2 === 1 ? 'border-l border-line pl-4' : ''}`}>
            <p className="text-label text-ink">{heading}</p>
            {details.map((detail) => <p key={detail} className="text-xs text-ink-soft">{detail}</p>)}
          </div>
        ))}
        {isTwoColumn && <span aria-hidden="true" className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">1 → 2</span>}
      </div>
    </div>
  )
}
export function ParserDemo() {
  const [selected, setSelected] = useState<DemoTab>('two-column')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const selectedIndex = TABS.findIndex((tab) => tab.id === selected)
  const extractedText =
    selected === 'two-column'
      ? PARSER_DEMO_DATA.twoColumn
      : PARSER_DEMO_DATA.oneTap

  function onTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) {
    let nextIndex: number | undefined

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % TABS.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = TABS.length - 1
    }

    if (nextIndex !== undefined) {
      event.preventDefault()
      const nextTab = TABS[nextIndex]
      setSelected(nextTab.id)
      tabRefs.current[nextIndex]?.focus()
    }
  }

  const activeTab = TABS[selectedIndex]

  return (
    <section
      id="see"
      aria-label="What the software sees"
      className="bg-paper-2 py-10 sm:py-14"
    >
      <div className="container-page grid gap-8">
        <SectionHeader
          index={4}
          label="What the software sees"
          title={LANDING_CONTENT.parser.title}
          labelClassName="text-ink-muted"
        />
        <p className="-mt-4 max-w-[62ch] text-ink-soft">
          {LANDING_CONTENT.parser.sub}
        </p>
        <div
          role="tablist"
          aria-label="Choose a CV layout"
          className="inline-grid min-h-11 w-fit max-w-full grid-cols-2 rounded-lg border border-line bg-paper p-1"
        >
          {TABS.map((tab, index) => (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              id={`parser-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected === tab.id}
              aria-controls="parser-demo-panel"
              tabIndex={selected === tab.id ? 0 : -1}
              onClick={() => setSelected(tab.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`min-h-11 rounded-md px-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent sm:px-4 ${
                selected === tab.id
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          id="parser-demo-panel"
          role="tabpanel"
          aria-labelledby={`parser-tab-${activeTab.id}`}
          tabIndex={0}
          className="grid min-w-0 gap-5 outline-none focus-visible:outline-accent lg:grid-cols-2"
        >
          <section className="grid min-w-0 content-start gap-3">
            <h3 className="text-label text-ink-muted">The page</h3>
            <PageMock activeTab={selected} />
          </section>
          <section className="grid min-w-0 content-start gap-3">
            <h3 className="text-label text-ink-muted">Extracted text</h3>
            <pre
              key={selected}
              className="parser-demo-panel max-h-80 min-h-64 max-w-full overflow-auto rounded-sm border border-line bg-paper p-5 font-mono text-xs leading-6 text-ink sm:p-7"
            >
              {extractedText.join('\n')}
            </pre>
          </section>
        </div>
        <p className="text-sm text-ink-muted">
          {LANDING_CONTENT.parser.caption}
        </p>
      </div>
    </section>
  )
}
