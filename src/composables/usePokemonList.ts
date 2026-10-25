import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { getPokemonList } from '@/api/pokeapi'
import type { PokemonSummary } from '@/types/pokemon'
import { toSummary } from '@/utils/format'

/**
 * Loads one page of Pokémon and reloads whenever `page` changes.
 * `page` can be a ref, a getter or a plain number (that's what MaybeRefOrGetter means).
 */
export function usePokemonList(page: MaybeRefOrGetter<number>, pageSize = 20) {
  const items = ref<PokemonSummary[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

  // Ignore answers from older requests if the user changes page quickly
  let lastRequest = 0

  async function load() {
    const requestId = ++lastRequest
    loading.value = true
    error.value = null

    try {
      const offset = (toValue(page) - 1) * pageSize
      const data = await getPokemonList(pageSize, offset)
      if (requestId !== lastRequest) return
      items.value = data.results.map(toSummary)
      total.value = data.count
    } catch (e) {
      if (requestId !== lastRequest) return
      error.value = e instanceof Error ? e : new Error(String(e))
      items.value = []
    } finally {
      if (requestId === lastRequest) loading.value = false
    }
  }

  // `immediate: true` runs it once right away (like onMounted) and again on every page change
  watch(() => toValue(page), load, { immediate: true })

  return { items, total, totalPages, loading, error, reload: load }
}
