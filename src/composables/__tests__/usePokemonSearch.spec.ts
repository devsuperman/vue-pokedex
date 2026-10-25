import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { clearCache } from '@/api/pokeapi'
import { mockFetch, withScope } from '@/test/helpers'
import { usePokemonSearch } from '../usePokemonSearch'

const names = ['bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon', 'charizard']
const allPokemon = {
  count: names.length,
  next: null,
  previous: null,
  results: names.map((name, i) => ({ name, url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/` })),
}

describe('usePokemonSearch', () => {
  beforeEach(() => clearCache())
  afterEach(() => vi.unstubAllGlobals())

  it('does not fetch until there is a search term', async () => {
    const fetchMock = mockFetch(() => ({ body: allPokemon }))
    const term = ref('')
    const search = withScope(() => usePokemonSearch(term))
    await flushPromises()
    expect(fetchMock).not.toHaveBeenCalled()

    term.value = 'char'
    await flushPromises()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(search.results.value.map((p) => p.name)).toEqual([
      'charmander',
      'charmeleon',
      'charizard',
    ])
    search.stop()
  })

  it('searches by number and finds exact matches', async () => {
    mockFetch(() => ({ body: allPokemon }))
    const term = ref('#4')
    const search = withScope(() => usePokemonSearch(term))
    await flushPromises()

    expect(search.results.value.map((p) => p.name)).toEqual(['charmander'])
    expect(search.exactMatch.value?.name).toBe('charmander')

    term.value = 'Ivysaur '
    expect(search.exactMatch.value?.id).toBe(2)
    search.stop()
  })

  it('limits the number of results', async () => {
    mockFetch(() => ({ body: allPokemon }))
    const search = withScope(() => usePokemonSearch('saur', 2))
    await flushPromises()

    expect(search.totalMatches.value).toBe(3)
    expect(search.results.value).toHaveLength(2)
    search.stop()
  })
})
