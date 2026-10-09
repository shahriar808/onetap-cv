import { useState } from 'react'
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from '../../../components/icons'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { useResumeStore } from '../../../store/resumeStore'
import { SECTION_REGISTRY } from '../sections/registry'
import { LANDING_CONTENT } from '../../landing/content'

const controlClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line px-3 text-sm font-medium text-ink hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent'

export function SectionPicker() {
  const enabledSections = useResumeStore((state) => state.data.enabled_sections)
  const storedOrder = useResumeStore((state) => state.data.section_order)
  const toggleSection = useResumeStore((state) => state.toggleSection)
  const moveSection = useResumeStore((state) => state.moveSection)
  const [announcement, setAnnouncement] = useState('')
  const orderedEnabled = [
    ...storedOrder.filter((id) => enabledSections.includes(id)),
    ...SECTION_REGISTRY.map((section) => section.id).filter((id) => enabledSections.includes(id) && !storedOrder.includes(id)),
  ]
  const enabled = orderedEnabled.map((id) => SECTION_REGISTRY.find((section) => section.id === id)).filter((section) => section !== undefined)
  const available = SECTION_REGISTRY.filter((section) => !enabledSections.includes(section.id))

  function move(sectionId: (typeof SECTION_REGISTRY)[number]['id'], direction: 'up' | 'down') {
    moveSection(sectionId, direction)
    const nextOrder = useResumeStore.getState().data.section_order.filter((id) => useResumeStore.getState().data.enabled_sections.includes(id))
    const position = nextOrder.indexOf(sectionId)
    const section = SECTION_REGISTRY.find((item) => item.id === sectionId)
    setAnnouncement(`${section?.label ?? 'Section'} moved to position ${position + 2} of ${nextOrder.length + 1}`)
  }

  return (
    <section aria-labelledby="section-picker-title" className="grid gap-6">
      <div>
        <h2 id="section-picker-title" className="font-display text-display-md font-semibold text-ink">
          {LANDING_CONTENT.builder.steps[1].title}
        </h2>
        <p className="mt-2 text-ink-soft">{LANDING_CONTENT.builder.steps[1].intro}</p>
      </div>
      <section aria-labelledby="enabled-sections-title" className="grid gap-2">
        <h3 id="enabled-sections-title" className="font-display text-display-sm font-semibold text-ink">On your CV (in this order)</h3>
        <ol aria-labelledby="enabled-sections-title" className="divide-y divide-line border-y border-line">
          <li className="grid min-w-0 gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="grid min-w-0 gap-1">
              <p className="font-display text-lg font-semibold text-ink">01 Contact details</p>
              <p className="text-sm text-ink-soft">Your contact information appears first on every CV.</p>
            </div>
            <span className="w-fit rounded-full bg-paper-2 px-3 py-1 text-xs font-semibold text-ink-soft">Always first</span>
          </li>
          {enabled.map((section, index) => (
            <li key={section.id} data-section-id={section.id} className="grid min-w-0 gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="grid min-w-0 content-start gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span aria-hidden="true" className="font-mono text-label text-ink-muted">{String(index + 2).padStart(2, '0')}</span>
                  <p className="font-display text-lg font-semibold text-ink">{section.label}</p>
                  {section.defaultEnabled && <Badge>Core</Badge>}
                </div>
                <p className="text-sm leading-5 text-ink-soft">{section.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" aria-label={`Move ${section.label} up`} disabled={index === 0} onClick={() => move(section.id, 'up')} className={controlClass}>
                  <ArrowUpIcon size={16} /><span className="sm:hidden">Move up</span>
                </button>
                <button type="button" aria-label={`Move ${section.label} down`} disabled={index === enabled.length - 1} onClick={() => move(section.id, 'down')} className={controlClass}>
                  <ArrowDownIcon size={16} /><span className="sm:hidden">Move down</span>
                </button>
                <button type="button" aria-label={`Remove ${section.label}`} onClick={() => toggleSection(section.id)} className={controlClass}>
                  <TrashIcon size={16} /><span>Remove</span>
                </button>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section aria-labelledby="available-sections-title" className="grid gap-2">
        <h3 id="available-sections-title" className="font-display text-display-sm font-semibold text-ink">Available to add</h3>
        {available.length ? (
          <ul className="divide-y divide-line border-y border-line">
            {available.map((section) => (
              <li key={section.id} className="grid min-w-0 gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="grid min-w-0 gap-1">
                  <p className="font-display text-lg font-semibold text-ink">{section.label}</p>
                  <p className="text-sm leading-5 text-ink-soft">{section.description}</p>
                </div>
                <Button variant="secondary" className="min-h-11 w-full sm:w-auto" onClick={() => toggleSection(section.id)}><PlusIcon size={16} />Add {section.label}</Button>
              </li>
            ))}
          </ul>
        ) : <p className="py-3 text-sm text-ink-soft">All available sections are on your CV.</p>}
      </section>
      <p className="sr-only" aria-live="polite">{announcement}</p>
    </section>
  )
}
