import { useEffect, useState } from 'react'

function showImmediately() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return true
  }
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

export function useReveal() {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [visible, setVisible] = useState(showImmediately)

  useEffect(() => {
    if (!element || visible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [element, visible])

  return { setElement, visible }
}
