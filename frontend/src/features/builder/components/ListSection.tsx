import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Dialog } from '../../../components/ui/Dialog'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
} from '../../../components/icons'
import { useResumeStore } from '../../../store/resumeStore'
import type { ResumeData, SectionId } from '../../../types/resume'
import { itemSummary } from '../lib/itemSummary'

type ListSectionId = Exclude<SectionId, 'summary' | 'interests'>
type SectionItem<Id extends ListSectionId> = ResumeData[Id][number]

interface ListSectionProps<Id extends ListSectionId> {
  sectionId: Id
  itemTitle: (item: SectionItem<Id>, index: number) => string
  renderItem: (
    item: SectionItem<Id>,
    update: (patch: Partial<SectionItem<Id>>) => void,
  ) => React.ReactNode
  emptyItem: () => SectionItem<Id>
  addLabel: string
}

function hasText(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  if (Array.isArray(value)) {
    return value.some(hasText)
  }
  if (value && typeof value === 'object') {
    return Object.values(value).some(hasText)
  }
  return false
}

export function ListSection<Id extends ListSectionId>({
  sectionId,
  itemTitle,
  renderItem,
  emptyItem,
  addLabel,
}: ListSectionProps<Id>) {
  const items = useResumeStore((state) => state.data[sectionId])
  const addItem = useResumeStore((state) => state.addItem)
  const updateItem = useResumeStore((state) => state.updateItem)
  const removeItem = useResumeStore((state) => state.removeItem)
  const moveItem = useResumeStore((state) => state.moveItem)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [collapsedItemIds, setCollapsedItemIds] = useState<Set<string>>(
    () => new Set(),
  )
  const pendingDeleteItem = items.find((item) => item.id === pendingDeleteId)

  function requestDelete(item: SectionItem<Id>) {
    const { id: _id, ...content } = item
    const hasUserContent = Object.entries(content).some(
      ([key, value]) => key !== 'gpa_label' && hasText(value),
    )
    if (hasUserContent) {
      setPendingDeleteId(item.id)
    } else {
      removeItem(sectionId, item.id)
    }
  }

  function toggleCollapsed(itemId: string) {
    setCollapsedItemIds((current) => {
      const next = new Set(current)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }

  return (
    <div className="grid gap-4">
      {items.map((item, index) => {
        const title = itemTitle(item, index)
        const expanded = !collapsedItemIds.has(item.id)
        return (
          <Card key={item.id} className="grid gap-4">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-ink">{title}</h3>
                {!expanded && (
                  <p className="mt-1 truncate text-sm text-ink-muted">
                    {itemSummary(sectionId, item)}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  aria-label={`Move ${title} up`}
                  title={`Move ${title} up`}
                  disabled={index === 0}
                  className="size-11 p-0"
                  onClick={() => moveItem(sectionId, index, index - 1)}
                >
                  <ArrowUpIcon size={18} />
                </Button>
                <Button
                  variant="ghost"
                  aria-label={`Move ${title} down`}
                  title={`Move ${title} down`}
                  disabled={index === items.length - 1}
                  className="size-11 p-0"
                  onClick={() => moveItem(sectionId, index, index + 1)}
                >
                  <ArrowDownIcon size={18} />
                </Button>
                <Button
                  variant="ghost"
                  aria-label={`Delete ${title}`}
                  title={`Delete ${title}`}
                  className="size-11 p-0 text-danger hover:bg-danger/10"
                  onClick={() => requestDelete(item)}
                >
                  <TrashIcon size={18} />
                </Button>
                <Button
                  variant="ghost"
                  aria-label={`${expanded ? 'Collapse' : 'Expand'} ${title}`}
                  aria-expanded={expanded}
                  title={`${expanded ? 'Collapse' : 'Expand'} ${title}`}
                  className="size-11 p-0"
                  onClick={() => toggleCollapsed(item.id)}
                >
                  {expanded ? (
                    <ChevronUpIcon size={18} />
                  ) : (
                    <ChevronDownIcon size={18} />
                  )}
                </Button>
              </div>
            </div>
            {expanded && (
              <div className="border-t border-line pt-4">
                {renderItem(item, (patch) =>
                  updateItem(sectionId, item.id, patch),
                )}
              </div>
            )}
          </Card>
        )
      })}
      <Button
        variant="secondary"
        className="w-full md:w-fit"
        onClick={() => addItem(sectionId, emptyItem())}
      >
        <PlusIcon size={18} />
        Add {addLabel}
      </Button>
      <Dialog
        open={pendingDeleteItem !== undefined}
        title="Delete this item?"
        message="This item contains information. Are you sure you want to delete it?"
        confirmLabel="Delete"
        onConfirm={() => {
          if (pendingDeleteId) {
            removeItem(sectionId, pendingDeleteId)
          }
          setPendingDeleteId(null)
        }}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  )
}
