import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { PokemonSummary } from '@/types/pokemon'

export const STORAGE_KEY = 'pokedex:favorites'

function loadFromStorage(): PokemonSummary[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as PokemonSummary[]) : []
  } catch {
    // Storage blocked (private mode) or corrupted JSON: start empty
    return []
  }
}

/**
 * "Setup store": ref() = state, computed() = getters, functions = actions.
 * Any component that calls useFavoritesStore() shares the same instance.
 */
export const useFavoritesStore = defineStore('favorites', () => {
  const items = ref<PokemonSummary[]>(loadFromStorage())

  const count = computed(() => items.value.length)
  const sortedItems = computed(() => [...items.value].sort((a, b) => a.id - b.id))

  function isFavorite(id: number): boolean {
    return items.value.some((p) => p.id === id)
  }

  function add(pokemon: PokemonSummary) {
    if (isFavorite(pokemon.id)) return
    // Copy only the fields we need, so we never store a whole API response
    items.value.push({ id: pokemon.id, name: pokemon.name, image: pokemon.image })
  }

  function remove(id: number) {
    items.value = items.value.filter((p) => p.id !== id)
  }

  function toggle(pokemon: PokemonSummary) {
    if (isFavorite(pokemon.id)) remove(pokemon.id)
    else add(pokemon)
  }

  // Persist every change. `deep: true` also catches push() into the array.
  watch(
    items,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        // Ignore: favorites still work for this visit
      }
    },
    { deep: true },
  )

  return { items, count, sortedItems, isFavorite, add, remove, toggle }
})
