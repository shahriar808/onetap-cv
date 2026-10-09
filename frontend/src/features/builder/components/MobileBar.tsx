import { Button } from '../../../components/ui/Button'

interface MobileBarProps {
  activeTab: 'edit' | 'preview'
  onTabChange: (tab: 'edit' | 'preview') => void
  previousDisabled: boolean
  onPrevious: () => void
  primaryLabel: string
  onPrimaryAction: () => void
}

export function MobileBar({
  activeTab,
  onTabChange,
  previousDisabled,
  onPrevious,
  primaryLabel,
  onPrimaryAction,
}: MobileBarProps) {
  return (
    <nav
      aria-label="Mobile builder controls"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden"
    >
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3">
        <div
          role="group"
          aria-label="Builder view"
          className="grid min-h-12 grid-cols-2 rounded-lg border border-line bg-paper-2 p-1"
        >
          <button
            type="button"
            aria-pressed={activeTab === 'edit'}
            onClick={() => onTabChange('edit')}
            className={`min-h-12 rounded-md px-3 text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
              activeTab === 'edit'
                ? 'bg-paper text-ink shadow-sm'
                : 'text-ink-muted'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            aria-pressed={activeTab === 'preview'}
            onClick={() => onTabChange('preview')}
            className={`min-h-12 rounded-md px-3 text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
              activeTab === 'preview'
                ? 'bg-paper text-ink shadow-sm'
                : 'text-ink-muted'
            }`}
          >
            Preview
          </button>
        </div>
        <Button
          variant="secondary"
          className="!min-h-12 px-3"
          onClick={onPrevious}
          disabled={previousDisabled}
        >
          Back
        </Button>
        <Button
          className="!min-h-12 px-3"
          onClick={onPrimaryAction}
        >
          {primaryLabel}
        </Button>
      </div>
    </nav>
  )
}
