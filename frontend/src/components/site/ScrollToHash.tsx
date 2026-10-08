import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToHash() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (!hash) {
        window.scrollTo({ top: 0, behavior: 'auto' })
        return
      }
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [pathname, search, hash])

  return null
}
