import { useRef, useState, type PointerEvent } from 'react'
import { PlusIcon, TrashIcon } from '../../../components/icons'
import { Button } from '../../../components/ui/Button'
import { useResumeStore } from '../../../store/resumeStore'
import { SECTION_REGISTRY } from '../sections/registry'
import { LANDING_CONTENT } from '../../landing/content'

const positionClass = 'min-h-11 rounded-md border border-line bg-paper px-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent'

type SectionId = (typeof SECTION_REGISTRY)[number]['id']

export function SectionPicker() {
  const enabledSections = useResumeStore((state) => state.data.enabled_sections)
  const storedOrder = useResumeStore((state) => state.data.section_order)
  const toggleSection = useResumeStore((state) => state.toggleSection)
  const moveSection = useResumeStore((state) => state.moveSection)
  const [announcement, setAnnouncement] = useState('')
  const [draggedSection, setDraggedSection] = useState<SectionId | null>(null)
  const [dropPosition, setDropPosition] = useState<number | null>(null)
  const pointerDrag = useRef<{ sectionId: SectionId; pointerId: number; position: number } | null>(null)
  const orderedEnabled = [
    ...storedOrder.filter((id) => enabledSections.includes(id)),
    ...SECTION_REGISTRY.map((section) => section.id).filter((id) => enabledSections.includes(id) && !storedOrder.includes(id)),
  ]
  const enabled = orderedEnabled.map((id) => SECTION_REGISTRY.find((section) => section.id === id)).filter((section) => section !== undefined)
  const available = SECTION_REGISTRY.filter((section) => !enabledSections.includes(section.id))

  function move(sectionId: SectionId, targetPosition: number) {
    moveSection(sectionId, targetPosition)
    const state = useResumeStore.getState().data
    const nextOrder = state.section_order.filter((id) => state.enabled_sections.includes(id))
    const position = nextOrder.indexOf(sectionId)
    const section = SECTION_REGISTRY.find((item) => item.id === sectionId)
    setAnnouncement(`${section?.label ?? 'Section'} moved to position ${position + 1} of ${nextOrder.length}`)
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>, sectionId: SectionId, position: number) {
    if (event.button !== 0) return
    event.preventDefault()
    pointerDrag.current = { sectionId, pointerId: event.pointerId, position }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDraggedSection(sectionId)
    setDropPosition(position)
  }

  function trackDrag(event: PointerEvent<HTMLButtonElement>) {
    const activeDrag = pointerDrag.current
    if (!activeDrag || activeDrag.pointerId !== event.pointerId) return
    const row = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-section-id]')
    const position = enabled.findIndex((section) => section.id === row?.dataset.sectionId)
    if (position >= 0 && position !== activeDrag.position) {
      activeDrag.position = position
      setDropPosition(position)
    }
  }

  function finishDrag(event: PointerEvent<HTMLButtonElement>) {
    const activeDrag = pointerDrag.current
    if (!activeDrag || activeDrag.pointerId !== event.pointerId) return
    if (activeDrag.position !== enabled.findIndex((section) => section.id === activeDrag.sectionId)) {
      move(activeDrag.sectionId, activeDrag.position)
    }
    pointerDrag.current = null
    setDraggedSection(null)
    setDropPosition(null)
  }

  function cancelDrag(event: PointerEvent<HTMLButtonElement>) {
    if (pointerDrag.current?.pointerId !== event.pointerId) return
    pointerDrag.current = null
    setDraggedSection(null)
    setDropPosition(null)
  }

  return (
    <section aria-labelledby="section-picker-title" className="grid gap-6">
      <div>
        <h2 id="section-picker-title" className="font-display text-display-md font-semibold text-ink">{LANDING_CONTENT.builder.steps[1].title}</h2>
        <p className="mt-2 text-ink-soft">{LANDING_CONTENT.builder.steps[1].intro}</p>
      </div>
      <section aria-labelledby="enabled-sections-title" className="grid gap-2">
        <h3 id="enabled-sections-title" className="font-display text-display-sm font-semibold text-ink">On your CV (in this order)</h3>
        <ol aria-labelledby="enabled-sections-title" className="divide-y divide-line border-y border-line">
          <li className="grid min-w-0 gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="grid min-w-0 gap-1">
              <p className="font-display text-lg font-semibold text-ink">Contact details</p>
              <p className="text-sm text-ink-soft">Your contact information appears first on every CV.</p>
            </div>
            <span className="w-fit rounded-full bg-paper-2 px-3 py-1 text-xs font-semibold text-ink-soft">Always first</span>
          </li>
          {enabled.map((section, index) => (
            <li key={section.id} data-section-id={section.id} className={`grid min-w-0 gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${dropPosition === index && draggedSection !== section.id ? 'rounded-md bg-paper-2/60' : ''}`}>
              <div className="grid min-w-0 content-start gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span aria-hidden="true" className="font-mono text-label text-ink-muted">{String(index + 1).padStart(2, '0')}</span>
                  <p className="font-display text-lg font-semibold text-ink">{section.label}</p>
                </div>
                <p className="text-sm leading-5 text-ink-soft">{section.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" aria-label={`Drag ${section.label} to reorder`} onPointerDown={(event) => startDrag(event, section.id, index)} onPointerMove={trackDrag} onPointerUp={finishDrag} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag} className="grid size-11 touch-none cursor-grab place-items-center rounded-md text-ink-muted hover:bg-paper-2 active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                  <svg aria-hidden="true" width="16" height="18" viewBox="0 0 16 18" fill="currentColor"><circle cx="5" cy="3" r="1.4"/><circle cx="11" cy="3" r="1.4"/><circle cx="5" cy="9" r="1.4"/><circle cx="11" cy="9" r="1.4"/><circle cx="5" cy="15" r="1.4"/><circle cx="11" cy="15" r="1.4"/></svg>
                </button>
                <label className="sr-only" htmlFor={`section-position-${section.id}`}>Position for {section.label}</label>
                <select id={`section-position-${section.id}`} aria-label={`Position for ${section.label}`} value={index} onChange={(event) => move(section.id, Number(event.target.value))} className={positionClass}>
                  {enabled.map((option, position) => <option key={option.id} value={position}>{position + 1} of {enabled.length}</option>)}
                </select>
                <button type="button" aria-label={`Remove ${section.label}`} title={`Remove ${section.label}`} onClick={() => toggleSection(section.id)} className="grid size-9 place-items-center rounded-md text-ink-muted hover:bg-paper-2 hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"><TrashIcon size={15} /></button>
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
                <div className="grid min-w-0 gap-1"><p className="font-display text-lg font-semibold text-ink">{section.label}</p><p className="text-sm leading-5 text-ink-soft">{section.description}</p></div>
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