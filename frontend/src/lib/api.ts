export const API_BASE = import.meta.env.VITE_API_URL ?? ''

export async function getHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE}/api/health`)

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`)
  }

  const result: unknown = await response.json()

  if (
    typeof result !== 'object' ||
    result === null ||
    !('status' in result) ||
    typeof result.status !== 'string'
  ) {
    throw new Error('Health check returned an invalid response')
  }

  return { status: result.status }
}
