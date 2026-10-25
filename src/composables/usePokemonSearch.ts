import { computed, ref, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { getAllPokemon } from '@/api/pokeapi'
import type { PokemonSummary } from '@/types/pokemon'

/**
 * Client-side search: PokéAPI has no search endpoint, so we download the
 * lightweight list of all names once (only when the user starts searching)
 * and filter it with a computed.
 */
export function usePokemonSearch(term: MaybeRefOrGetter<string>, maxResults = 48) {
  // shallowRef: the list is replaced as a whole, no need to make every item deeply reactive
  const all = shallowRef<PokemonSummary[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const normalizedTerm = computed(() => toValue(term).trim().toLowerCase().replace(/^#/, ''))

  async function load() {
    if (all.value.length > 0 || loading.value) return
    loading.value = true
    error.value = null
    try {
      all.value = await getAllPokemon()
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      loading.value = false
    }
  }

  watch(
    normalizedTerm,
    (value) => {
      if (value) load()
    },
    { immediate: true },
  )

  const matches = computed(() => {
    const value = normalizedTerm.value
    if (!value) return []
    // "25" searches by number, anything else by name
    if (/^\d+$/.test(value)) return all.value.filter((p) => String(p.id).startsWith(value))
    return all.value.filter((p) => p.name.includes(value))
  })

  const results = computed(() => matches.value.slice(0, maxResults))
  const totalMatches = computed(() => matches.value.length)

  /** A Pokémon whose name or number is exactly the term, if any. */
  const exactMatch = computed(() => {
    const value = normalizedTerm.value
    return all.value.find((p) => p.name === value || String(p.id) === value) ?? null
  })

  return { results, totalMatches, exactMatch, loading, error, reload: load }
}
