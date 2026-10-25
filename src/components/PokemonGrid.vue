<script setup lang="ts">
import type { PokemonSummary } from '@/types/pokemon'
import PokemonCard from './PokemonCard.vue'

defineProps<{
  pokemons: PokemonSummary[]
  isFavorite: (id: number) => boolean
}>()

const emit = defineEmits<{ 'toggle-favorite': [pokemon: PokemonSummary] }>()
</script>

<template>
  <ul class="pokemon-grid">
    <!-- :key lets Vue track each item when the list changes -->
    <li v-for="pokemon in pokemons" :key="pokemon.id">
      <PokemonCard
        :pokemon="pokemon"
        :favorite="isFavorite(pokemon.id)"
        @toggle-favorite="emit('toggle-favorite', $event)"
      />
    </li>
  </ul>
</template>

<style scoped>
.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--space-4);
  padding: 0;
  list-style: none;
}

@media (min-width: 640px) {
  .pokemon-grid {
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: var(--space-6);
  }
}
</style>
