import { ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { getPokemon } from '@/api/pokeapi'
import type { PokemonDetail } from '@/types/pokemon'

/** Loads one Pokémon and reloads when `nameOrId` changes (e.g. the route param). */
export function usePokemon(nameOrId: MaybeRefOrGetter<string | number>) {
  const pokemon = ref<PokemonDetail | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  let lastRequest = 0

  async function load() {
    const requestId = ++lastRequest
    loading.value = true
    error.value = null

    try {
      const data = await getPokemon(toValue(nameOrId))
      if (requestId === lastRequest) pokemon.value = data
    } catch (e) {
      if (requestId !== lastRequest) return
      error.value = e instanceof Error ? e : new Error(String(e))
      pokemon.value = null
    } finally {
      if (requestId === lastRequest) loading.value = false
    }
  }

  watch(() => toValue(nameOrId), load, { immediate: true })

  return { pokemon, loading, error, reload: load }
}
