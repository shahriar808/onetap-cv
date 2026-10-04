import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Dialog } from '../../../components/ui/Dialog'
import { safeLocalStorage } from '../../../lib/storage'
import { useResumeStore } from '../../../store/resumeStore'

interface ClearDataButtonProps {
  onCleared: () => void
}

export function ClearDataButton({ onCleared }: ClearDataButtonProps) {
  const [open, setOpen] = useState(false)
  const resetAll = useResumeStore((state) => state.resetAll)

  function clearData() {
    resetAll()
    safeLocalStorage.removeItem('cvbuilder:v1')
    setOpen(false)
    onCleared()
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Clear all my data
      </Button>
      <Dialog
        open={open}
        title="Clear all your resume data?"
        message="This permanently removes the resume saved in this browser."
        confirmLabel="Clear all data"
        cancelLabel="Keep my data"
        onConfirm={clearData}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
