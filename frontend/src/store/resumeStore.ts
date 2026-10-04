import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { defaultResume, type TemplateId } from '../lib/defaults'
import { CURRENT_VERSION, runMigrations } from '../lib/migrations'
import { safeLocalStorage } from '../lib/storage'
import type { Contact, ResumeData } from '../types/resume'

export interface ResumeState {
  data: ResumeData
  selectedTemplate: TemplateId
  updateContact: (patch: Partial<Contact>) => void
  setTemplate: (template: TemplateId) => void
  resetAll: () => void
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
    }),
    {
      name: 'cvbuilder:v1',
      version: CURRENT_VERSION,
      migrate: runMigrations,
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
)
