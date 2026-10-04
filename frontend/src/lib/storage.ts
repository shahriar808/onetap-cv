import type { StateStorage } from 'zustand/middleware'

const memoryStorage = new Map<string, string>()

export const safeLocalStorage: StateStorage = {
  getItem(name) {
    try {
      const value = localStorage.getItem(name)
      if (value !== null) {
        memoryStorage.set(name, value)
        return value
      }
    } catch {
      return memoryStorage.get(name) ?? null
    }

    return memoryStorage.get(name) ?? null
  },
  setItem(name, value) {
    memoryStorage.set(name, value)
    try {
      localStorage.setItem(name, value)
    } catch {
      return
    }
  },
  removeItem(name) {
    memoryStorage.delete(name)
    try {
      localStorage.removeItem(name)
    } catch {
      return
    }
  },
}
