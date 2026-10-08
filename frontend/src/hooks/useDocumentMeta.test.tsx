import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDocumentMeta } from './useDocumentMeta'

function MetaPage() {
  useDocumentMeta({ title: 'Test page | OneTap CV', description: 'A test description.' })
  return null
}

describe('useDocumentMeta', () => {
  it('updates the document title and description', () => {
    render(<MetaPage />)
    expect(document.title).toBe('Test page | OneTap CV')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('A test description.')
  })
})
