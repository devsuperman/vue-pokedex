<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFavoritesStore } from '@/stores/favorites'
import PokemonGrid from '@/components/PokemonGrid.vue'
import EmptyState from '@/components/EmptyState.vue'

const favorites = useFavoritesStore()
// storeToRefs keeps state/getters reactive when destructuring (actions can be used directly)
const { sortedItems, count } = storeToRefs(favorites)
</script>

<template>
  <h1 class="title">
    Favorites <span v-if="count" class="title__count">({{ count }})</span>
  </h1>

  <PokemonGrid
    v-if="count"
    :pokemons="sortedItems"
    :is-favorite="favorites.isFavorite"
    @toggle-favorite="favorites.toggle"
  />

  <EmptyState v-else title="No favorites yet">
    Tap the heart on any Pokémon to keep it here. Your favorites are saved in this browser.
    <template #actions>
      <RouterLink class="btn btn--primary" :to="{ name: 'home' }">Browse Pokémon</RouterLink>
    </template>
  </EmptyState>
</template>

<style scoped>
.title {
  margin-bottom: var(--space-6);
}

.title__count {
  color: var(--color-text-muted);
  font-weight: 500;
}
</style>
