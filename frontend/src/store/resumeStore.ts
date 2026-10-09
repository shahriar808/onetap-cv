import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { defaultResume, type TemplateId } from '../lib/defaults'
import { CURRENT_VERSION, runMigrations } from '../lib/migrations'
import { safeLocalStorage } from '../lib/storage'
import type { Contact, ResumeData, SectionId } from '../types/resume'

type SingleSectionId = 'summary' | 'interests'
type ListSectionId = Exclude<SectionId, SingleSectionId>

function updateListSection<Id extends ListSectionId>(
  data: ResumeData,
  sectionId: Id,
  update: (items: ResumeData[Id]) => ResumeData[Id],
): ResumeData {
  return {
    ...data,
    [sectionId]: update(data[sectionId]),
  }
}

export interface ResumeState {
  data: ResumeData
  selectedTemplate: TemplateId
  updateContact: (patch: Partial<Contact>) => void
  setTemplate: (template: TemplateId) => void
  resetAll: () => void
  toggleSection: (sectionId: SectionId) => void
  moveSection: (sectionId: SectionId, targetPosition: number) => void
  updateSingle: <Id extends SingleSectionId>(
    sectionId: Id,
    patch: Partial<ResumeData[Id]>,
  ) => void
  addItem: <Id extends ListSectionId>(
    sectionId: Id,
    item: ResumeData[Id][number],
  ) => void
  updateItem: <Id extends ListSectionId>(
    sectionId: Id,
    itemId: string,
    patch: Partial<ResumeData[Id][number]>,
  ) => void
  removeItem: (sectionId: ListSectionId, itemId: string) => void
  moveItem: (sectionId: ListSectionId, from: number, to: number) => void
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      data: defaultResume(),
      selectedTemplate: 'modern',
      updateContact: (patch) =>
        set((state) => ({
          data: {
            ...state.data,
            contact: { ...state.data.contact, ...patch },
          },
        })),
      setTemplate: (selectedTemplate) => set({ selectedTemplate }),
      resetAll: () =>
        set({ data: defaultResume(), selectedTemplate: 'modern' }),
      toggleSection: (sectionId) =>
        set((state) => {
          const enabled = state.data.enabled_sections.includes(sectionId)
          return {
            data: {
              ...state.data,
              enabled_sections: enabled
                ? state.data.enabled_sections.filter((id) => id !== sectionId)
                : [...state.data.enabled_sections, sectionId],
              section_order: enabled
                ? state.data.section_order.filter((id) => id !== sectionId)
                : state.data.section_order.includes(sectionId)
                  ? state.data.section_order
                  : [...state.data.section_order, sectionId],
            },
          }
        }),
      moveSection: (sectionId, targetPosition) =>
        set((state) => {
          if (!state.data.enabled_sections.includes(sectionId)) return state
          const order = [...state.data.section_order]
          const enabledOrder = order.filter((id) => state.data.enabled_sections.includes(id))
          const position = enabledOrder.indexOf(sectionId)
          if (position < 0 || targetPosition < 0 || targetPosition >= enabledOrder.length || position === targetPosition) return state
          enabledOrder.splice(position, 1)
          enabledOrder.splice(targetPosition, 0, sectionId)
          let nextIndex = 0
          for (let index = 0; index < order.length; index += 1) {
            if (state.data.enabled_sections.includes(order[index])) order[index] = enabledOrder[nextIndex++]
          }
          return { data: { ...state.data, section_order: order } }
        }),
      updateSingle: (sectionId, patch) =>
        set((state) => {
          if (sectionId === 'summary') {
            return {
              data: {
                ...state.data,
                summary: { ...state.data.summary, ...patch },
              },
            }
          }

          return {
            data: {
              ...state.data,
              interests: { ...state.data.interests, ...patch },
            },
          }
        }),
      addItem: <Id extends ListSectionId>(
        sectionId: Id,
        item: ResumeData[Id][number],
      ) =>
        set((state) => ({
          data: updateListSection<Id>(state.data, sectionId, (items) => [
            ...items,
            item,
          ] as ResumeData[Id]),
        })),
      updateItem: <Id extends ListSectionId>(
        sectionId: Id,
        itemId: string,
        patch: Partial<ResumeData[Id][number]>,
      ) =>
        set((state) => ({
          data: updateListSection<Id>(state.data, sectionId, (items) =>
            items.map((item) =>
              item.id === itemId ? { ...item, ...patch } : item,
            ) as ResumeData[Id],
          ),
        })),
      removeItem: (sectionId, itemId) =>
        set((state) => {
          const removeFromItems = <Id extends ListSectionId>(
            id: Id,
          ): ResumeData => updateListSection<Id>(
            state.data,
            id,
            (items) => items.filter((item) => item.id !== itemId) as ResumeData[Id],
          )
          return { data: removeFromItems(sectionId) }
        }),
      moveItem: (sectionId, from, to) =>
        set((state) => {
          const moveWithinItems = <Id extends ListSectionId>(
            id: Id,
          ): ResumeData => updateListSection<Id>(state.data, id, (items) => {
            if (
              from < 0 ||
              to < 0 ||
              from >= items.length ||
              to >= items.length ||
              from === to
            ) {
              return items
            }

            const reordered = [...items]
            const [item] = reordered.splice(from, 1)
            reordered.splice(to, 0, item)
            return reordered as ResumeData[Id]
          })
          return { data: moveWithinItems(sectionId) }
        }),
    }),
    {
      name: 'cvbuilder:v1',
      version: CURRENT_VERSION,
      migrate: runMigrations,
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
)
