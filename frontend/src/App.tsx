import { useEffect, useState } from 'react'
import { getHealth } from './lib/api'

type HealthStatus = 'checking' | 'ok' | 'down'

function App() {
  const [health, setHealth] = useState<HealthStatus>('checking')

  useEffect(() => {
    let active = true

    getHealth()
      .then(({ status }) => {
        if (active) {
          setHealth(status === 'ok' ? 'ok' : 'down')
        }
      })
      .catch(() => {
        if (active) {
          setHealth('down')
        }
      })

    return () => {
      active = false
    }
  }, [])

  const message =
    health === 'ok'
      ? 'API: ok'
      : health === 'down'
        ? 'API: down'
        : 'Checking API…'

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-700">
        OneTap CV
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        Build an ATS-friendly CV
      </h1>
      <p className="mt-4 max-w-xl text-lg text-slate-600">
        A simple, private CV builder is on its way.
      </p>
      <p className="mt-8 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
        {message}
      </p>
    </main>
  )
}

export default App
