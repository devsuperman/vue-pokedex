<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  active: boolean
  /** Pokémon name, used for the accessible label */
  name: string
}>()

const emit = defineEmits<{ toggle: [] }>()

const label = computed(() =>
  props.active ? `Remove ${props.name} from favorites` : `Add ${props.name} to favorites`,
)
</script>

<template>
  <button
    type="button"
    class="favorite-button"
    :class="{ 'favorite-button--active': active }"
    :aria-pressed="active"
    :aria-label="label"
    :title="label"
    @click="emit('toggle')"
  >
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M12 21s-7.5-4.6-10-9.3C.4 8.4 2.3 4 6.4 4c2.3 0 3.9 1.3 5.6 3.3C13.7 5.3 15.3 4 17.6 4c4.1 0 6 4.4 4.4 7.7C19.5 16.4 12 21 12 21z"
      />
    </svg>
  </button>
</template>

<style scoped>
.favorite-button {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-surface);
  transition: transform 0.15s;
}

.favorite-button:hover {
  transform: scale(1.1);
}

.favorite-button path {
  fill: transparent;
  stroke: var(--color-text-muted);
  stroke-width: 2;
}

.favorite-button--active path {
  fill: var(--color-primary);
  stroke: var(--color-primary);
}
</style>
