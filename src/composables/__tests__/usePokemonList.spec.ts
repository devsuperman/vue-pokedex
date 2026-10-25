import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { clearCache } from '@/api/pokeapi'
import { listResponse, mockFetch, withScope } from '@/test/helpers'
import { usePokemonList } from '../usePokemonList'

describe('usePokemonList', () => {
  beforeEach(() => clearCache())
  afterEach(() => vi.unstubAllGlobals())

  it('loads the first page', async () => {
    const fetchMock = mockFetch((url) => {
      const params = new URL(url).searchParams
      return { body: listResponse(45, Number(params.get('offset')), Number(params.get('limit'))) }
    })

    const list = withScope(() => usePokemonList(1))
    expect(list.loading.value).toBe(true)
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0')
    expect(list.loading.value).toBe(false)
    expect(list.items.value).toHaveLength(20)
    expect(list.items.value[0]).toMatchObject({ id: 1, name: 'pokemon-1' })
    expect(list.totalPages.value).toBe(3)
    list.stop()
  })

  it('reloads when the page changes', async () => {
    mockFetch((url) => {
      const params = new URL(url).searchParams
      return { body: listResponse(45, Number(params.get('offset')), Number(params.get('limit'))) }
    })

    const page = ref(1)
    const list = withScope(() => usePokemonList(page))
    await flushPromises()

    page.value = 3
    await flushPromises()

    expect(list.items.value.map((p) => p.id)).toEqual([41, 42, 43, 44, 45])
    list.stop()
  })

  it('exposes errors and can retry', async () => {
    let fail = true
    mockFetch(() => (fail ? { status: 500 } : { body: listResponse(1, 0, 20) }))

    const list = withScope(() => usePokemonList(1))
    await flushPromises()
    expect(list.error.value?.message).toContain('500')
    expect(list.items.value).toEqual([])

    fail = false
    await list.reload()
    expect(list.error.value).toBeNull()
    expect(list.items.value).toHaveLength(1)
    list.stop()
  })
})
