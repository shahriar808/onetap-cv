interface MobileBarProps {
  activeTab: 'edit' | 'preview'
  onTabChange: (tab: 'edit' | 'preview') => void
  primaryLabel: string
  onPrimaryAction: () => void
}

export function MobileBar({
  activeTab,
  onTabChange,
  primaryLabel,
  onPrimaryAction,
}: MobileBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(15,23,42,0.08)] lg:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-3">
        <div
          role="group"
          aria-label="Builder view"
          className="grid min-h-11 grid-cols-2 rounded-lg bg-slate-100 p-1"
        >
          <button
            type="button"
            aria-pressed={activeTab === 'edit'}
            onClick={() => onTabChange('edit')}
            className={`min-h-11 rounded-md px-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 ${
              activeTab === 'edit'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            aria-pressed={activeTab === 'preview'}
            onClick={() => onTabChange('preview')}
            className={`min-h-11 rounded-md px-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 ${
              activeTab === 'preview'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600'
            }`}
          >
            Preview
          </button>
        </div>
        <button
          type="button"
          onClick={onPrimaryAction}
          className="min-h-11 rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  )
}
