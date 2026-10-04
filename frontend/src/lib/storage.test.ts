import { afterEach, describe, expect, it, vi } from 'vitest'
import { safeLocalStorage } from './storage'

describe('safeLocalStorage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reads and writes through browser localStorage', () => {
    safeLocalStorage.setItem('storage-test', 'saved')

    expect(safeLocalStorage.getItem('storage-test')).toBe('saved')

    safeLocalStorage.removeItem('storage-test')
    expect(safeLocalStorage.getItem('storage-test')).toBeNull()
  })

  it('falls back to memory when localStorage throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage unavailable')
    })
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage unavailable')
    })

    safeLocalStorage.setItem('blocked-storage-test', 'saved in memory')

    expect(safeLocalStorage.getItem('blocked-storage-test')).toBe(
      'saved in memory',
    )
  })

  it('removes values from the memory fallback', () => {
    safeLocalStorage.setItem('memory-remove-test', 'value')
    safeLocalStorage.removeItem('memory-remove-test')

    expect(safeLocalStorage.getItem('memory-remove-test')).toBeNull()
  })
})
