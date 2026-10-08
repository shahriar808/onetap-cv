import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { Toast } from './Toast'
import { ToastContext } from './ToastContext'

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<string | null>(null)
  const showToast = useCallback((message: string) => {
    setToast(message)
  }, [])
  const dismissToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    if (!toast) {
      return
    }
    const timeout = window.setTimeout(dismissToast, 4000)
    return () => window.clearTimeout(timeout)
  }, [toast, dismissToast])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed inset-x-4 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-[60] mx-auto max-w-sm lg:inset-x-auto lg:bottom-6 lg:right-6">
          <Toast message={toast} onDismiss={dismissToast} />
        </div>
      )}
    </ToastContext.Provider>
  )
}
