import { useState } from 'react'

const SHEETS = [
  { id: 'classic', label: 'Classic', src: '/thumbnails/landing-classic' },
  { id: 'modern', label: 'Modern', src: '/thumbnails/landing-modern' },
  { id: 'compact', label: 'Compact', src: '/thumbnails/landing-compact' },
] as const

function sheetTransform(
  id: (typeof SHEETS)[number]['id'],
  selected: (typeof SHEETS)[number]['id'],
  spread: boolean,
) {
  if (id === selected) {
    return 'translate(0, -10px) rotate(0deg) scale(1.02)'
  }
  const direction = id === 'classic' ? -1 : 1
  const distance = spread ? 32 : 17
  const rotation = (spread ? 11 : 7) * direction
  return `translate(${distance * direction}px, 7px) rotate(${rotation}deg)`
}

export function SheetFan() {
  const [selected, setSelected] = useState<(typeof SHEETS)[number]['id']>('modern')
  const [spread, setSpread] = useState(false)

  return (
    <figure className="grid justify-items-center gap-4">
      <div
        className="sheet-fan group relative mx-auto aspect-[4/5] w-full max-w-[420px]"
        onMouseEnter={() => setSpread(true)}
        onMouseLeave={() => setSpread(false)}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-sm opacity-70"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0 25px, rgba(23,32,42,.07) 26px, transparent 27px)',
          }}
        />
        {SHEETS.map((sheet, index) => (
          <div
            key={sheet.id}
            className="absolute left-[12%] top-[5%] h-[84%] w-[76%] transition-transform duration-300 ease-out"
            style={{
              zIndex: sheet.id === selected ? 4 : index + 1,
              transform: sheetTransform(sheet.id, selected, spread),
            }}
          >
            <img
              src={`${sheet.src}-480.webp`}
              srcSet={`${sheet.src}-480.webp 480w, ${sheet.src}-900.webp 900w`}
              sizes="(max-width: 768px) 76vw, 360px"
              alt={`${sheet.label} CV sheet, with Shahriar Hasan sample details`}
              width={900}
              height={1272}
              loading={sheet.id === selected ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={sheet.id === selected ? 'high' : 'auto'}
              className="h-full w-full rounded-[3px] border border-line bg-white object-cover shadow-paper"
            />
          </div>
        ))}
      </div>
      <div
        role="group"
        aria-label="Choose a CV design to preview"
        className="inline-grid min-h-11 grid-cols-3 rounded-lg border border-line bg-paper-2 p-1"
      >
        {SHEETS.map((sheet) => (
          <button
            key={sheet.id}
            type="button"
            aria-pressed={selected === sheet.id}
            onClick={() => setSelected(sheet.id)}
            className={`min-h-11 min-w-20 rounded-md px-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
              selected === sheet.id
                ? 'bg-paper text-ink shadow-sm'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            {sheet.label}
          </button>
        ))}
      </div>
    </figure>
  )
}
