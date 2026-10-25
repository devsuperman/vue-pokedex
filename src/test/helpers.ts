import { effectScope } from 'vue'
import { vi } from 'vitest'

/** Runs a composable inside an effect scope (like a component would) and returns its result. */
export function withScope<T>(fn: () => T): T & { stop: () => void } {
  const scope = effectScope()
  const result = scope.run(fn) as T
  return Object.assign(result as object, { stop: () => scope.stop() }) as T & { stop: () => void }
}

/** Replaces global fetch with a mock that answers each URL with the handler's result. */
export function mockFetch(handler: (url: string) => { status?: number; body?: unknown }) {
  const fetchMock = vi.fn<typeof fetch>(async (input) => {
    const { status = 200, body = {} } = handler(String(input))
    return new Response(JSON.stringify(body), { status })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

export function listResponse(count: number, offset: number, limit: number) {
  const results = Array.from({ length: Math.max(0, Math.min(limit, count - offset)) }, (_, i) => ({
    name: `pokemon-${offset + i + 1}`,
    url: `https://pokeapi.co/api/v2/pokemon/${offset + i + 1}/`,
  }))
  return { count, next: null, previous: null, results }
}
