import { useEffect } from 'react'

interface DocumentMetaOptions {
  title: string
  description: string
  path?: string
}

export function useDocumentMeta({ title, description, path }: DocumentMetaOptions) {
  useEffect(() => {
    document.title = title
    let descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta')
      descriptionTag.name = 'description'
      document.head.append(descriptionTag)
    }
    descriptionTag.content = description

    for (const [selector, attribute, key, content] of [
      ['meta[property="og:title"]', 'property', 'og:title', title],
      ['meta[property="og:description"]', 'property', 'og:description', description],
      ['meta[name="twitter:title"]', 'name', 'twitter:title', title],
      ['meta[name="twitter:description"]', 'name', 'twitter:description', description],
    ] as const) {
      let tag = document.querySelector<HTMLMetaElement>(selector)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attribute, key)
        document.head.append(tag)
      }
      tag.content = content
    }

    const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')
    if (!siteUrl || !path) return
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = `${siteUrl}${path}`
  }, [title, description, path])
}
