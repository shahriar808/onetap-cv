export const CURRENT_VERSION = 1

export function runMigrations(persisted: unknown, fromVersion: number): unknown {
  if (fromVersion > CURRENT_VERSION) {
    throw new Error(`Cannot load data from future version ${fromVersion}`)
  }

  return persisted
}
