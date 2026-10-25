import type { PokemonDetail, PokemonListResponse, PokemonSummary } from '@/types/pokemon'
import { toSummary } from '@/utils/format'

const BASE_URL = 'https://pokeapi.co/api/v2'

/** Thrown when the API answers 404, so views can show "not found" instead of a generic error. */
export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

/**
 * In-memory cache of requests (PokéAPI's fair-use policy asks clients to cache).
 * We store the promise, so two components asking for the same URL share one request.
 */
const cache = new Map<string, Promise<unknown>>()

function request<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`
  let promise = cache.get(url) as Promise<T> | undefined

  if (!promise) {
    promise = fetch(url).then(async (response) => {
      if (response.status === 404) throw new NotFoundError()
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
      return (await response.json()) as T
    })
    // Don't keep failed requests, so "Try again" really tries again
    promise.catch(() => cache.delete(url))
    cache.set(url, promise)
  }

  return promise
}

export function clearCache() {
  cache.clear()
}

export function getPokemonList(limit: number, offset: number): Promise<PokemonListResponse> {
  return request<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`)
}

export function getPokemon(nameOrId: string | number): Promise<PokemonDetail> {
  return request<PokemonDetail>(`/pokemon/${String(nameOrId).toLowerCase()}`)
}

/** Every Pokémon name + id (~1300 small entries). The API has no search, so we filter this. */
export async function getAllPokemon(): Promise<PokemonSummary[]> {
  const data = await request<PokemonListResponse>('/pokemon?limit=100000&offset=0')
  return data.results.map(toSummary)
}
