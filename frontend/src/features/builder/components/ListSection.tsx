import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Dialog } from '../../../components/ui/Dialog'
import { useResumeStore } from '../../../store/resumeStore'
import type { ResumeData, SectionId } from '../../../types/resume'

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

  return (
    <div className="grid gap-4">
      {items.map((item, index) => {
        const title = itemTitle(item, index)
        return (
          <Card key={item.id} className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  aria-label={`Move ${title} up`}
                  disabled={index === 0}
                  onClick={() => moveItem(sectionId, index, index - 1)}
                >
                  Move up
                </Button>
                <Button
                  variant="ghost"
                  aria-label={`Move ${title} down`}
                  disabled={index === items.length - 1}
                  onClick={() => moveItem(sectionId, index, index + 1)}
                >
                  Move down
                </Button>
                <Button
                  variant="ghost"
                  aria-label={`Delete ${title}`}
                  onClick={() => requestDelete(item)}
                >
                  Delete
                </Button>
              </div>
            </div>
            {renderItem(item, (patch) =>
              updateItem(sectionId, item.id, patch),
            )}
          </Card>
        )
      })}
      <Button
        variant="secondary"
        className="w-fit"
        onClick={() => addItem(sectionId, emptyItem())}
      >
        + {addLabel}
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
