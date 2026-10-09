import { useEffect, useState } from 'react'

export function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const key = ids.join(',')

  useEffect(() => {
    if (!key || !('IntersectionObserver' in window)) return
    const elements = key.split(',').map((id) => document.getElementById(id)).filter((element): element is HTMLElement => element !== null)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]?.target instanceof HTMLElement) setActiveId(visible[0].target.id)
    }, { rootMargin: '-30% 0px -60% 0px' })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [key])

  return key ? activeId : null
}
