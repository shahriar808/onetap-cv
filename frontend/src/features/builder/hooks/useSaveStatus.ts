import { useEffect, useState } from 'react'
import { useResumeStore } from '../../../store/resumeStore'

export function useSaveStatus(): string {
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined
    const unsubscribe = useResumeStore.subscribe((state, previousState) => {
      if (
        state.data === previousState.data &&
        state.selectedTemplate === previousState.selectedTemplate
      ) {
        return
      }

      setSaving(true)
      if (timeout !== undefined) {
        window.clearTimeout(timeout)
      }
      timeout = window.setTimeout(() => setSaving(false), 800)
    })

    return () => {
      unsubscribe()
      if (timeout !== undefined) {
        window.clearTimeout(timeout)
      }
    }
  }, [])

  return saving ? 'Saving…' : 'Saved in this browser'
}
