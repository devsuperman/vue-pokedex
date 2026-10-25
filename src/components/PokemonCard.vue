<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonSummary } from '@/types/pokemon'
import { formatName, padId } from '@/utils/format'
import fallbackImage from '@/assets/pokeball.svg'
import FavoriteButton from './FavoriteButton.vue'

const props = defineProps<{
  pokemon: PokemonSummary
  favorite: boolean
}>()

const emit = defineEmits<{ 'toggle-favorite': [pokemon: PokemonSummary] }>()

const displayName = computed(() => formatName(props.pokemon.name))
const number = computed(() => padId(props.pokemon.id))

function onImageError(event: Event) {
  const img = event.target as HTMLImageElement
  if (img.src !== fallbackImage) img.src = fallbackImage
}
</script>

<template>
  <article class="pokemon-card">
    <div class="pokemon-card__link">
      <img
        class="pokemon-card__image"
        :src="pokemon.image"
        :alt="displayName"
        width="160"
        height="160"
        loading="lazy"
        @error="onImageError"
      />
      <span class="pokemon-card__number">{{ number }}</span>
      <h2 class="pokemon-card__name">{{ displayName }}</h2>
    </div>
    <FavoriteButton
      class="pokemon-card__favorite"
      :active="favorite"
      :name="displayName"
      @toggle="emit('toggle-favorite', pokemon)"
    />
  </article>
</template>

<style scoped>
.pokemon-card {
  position: relative;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.pokemon-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.pokemon-card__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-4);
  border-radius: inherit;
  text-decoration: none;
}

.pokemon-card__image {
  width: 100%;
  max-width: 160px;
  height: auto;
  aspect-ratio: 1;
  object-fit: contain;
}

.pokemon-card__number {
  margin-top: var(--space-2);
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-weight: 600;
}

.pokemon-card__name {
  font-size: 1.05rem;
  text-align: center;
}

.pokemon-card__favorite {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
}
</style>
