<script setup lang="ts">
import { ref } from 'vue'
import type { PokemonSummary } from '@/types/pokemon'
import { artworkUrl } from '@/utils/format'
import PokemonGrid from '@/components/PokemonGrid.vue'
import TypeBadge from '@/components/TypeBadge.vue'

// Hard-coded data for now — replaced by the API in M2
const pokemons: PokemonSummary[] = [1, 4, 7, 25].map((id, i) => ({
  id,
  name: ['bulbasaur', 'charmander', 'squirtle', 'pikachu'][i]!,
  image: artworkUrl(id),
}))

const favoriteIds = ref(new Set<number>())

function isFavorite(id: number) {
  return favoriteIds.value.has(id)
}

function toggleFavorite(pokemon: PokemonSummary) {
  console.log('toggle-favorite', pokemon.name)
  if (favoriteIds.value.has(pokemon.id)) favoriteIds.value.delete(pokemon.id)
  else favoriteIds.value.add(pokemon.id)
}
</script>

<template>
  <h1 class="title">Pokédex</h1>
  <p class="types">
    <TypeBadge v-for="type in ['grass', 'fire', 'water', 'electric']" :key="type" :type="type" />
  </p>
  <PokemonGrid :pokemons="pokemons" :is-favorite="isFavorite" @toggle-favorite="toggleFavorite" />
</template>

<style scoped>
.title {
  margin: var(--space-6) 0 var(--space-2);
}

.types {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}
</style>
