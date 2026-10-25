<script setup lang="ts">
// defineModel() creates a two-way binding: the parent uses <SearchBar v-model="query" />
const model = defineModel<string>({ required: true })

const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <form class="search-bar" role="search" @submit.prevent="emit('submit')">
    <label for="pokemon-search" class="visually-hidden">Search Pokémon by name or number</label>
    <svg class="search-bar__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
    <input
      id="pokemon-search"
      v-model="model"
      class="search-bar__input"
      type="search"
      placeholder="Search by name or number…"
      autocomplete="off"
      spellcheck="false"
    />
    <button
      v-if="model"
      type="button"
      class="search-bar__clear"
      aria-label="Clear search"
      @click="model = ''"
    >
      ✕
    </button>
  </form>
</template>

<style scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-bar__icon {
  position: absolute;
  left: var(--space-4);
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-bar__input {
  width: 100%;
  padding: var(--space-3) 3rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.search-bar__input::-webkit-search-cancel-button {
  display: none;
}

.search-bar__input:focus-visible {
  outline-offset: 0;
}

.search-bar__clear {
  position: absolute;
  right: var(--space-2);
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-muted);
}

.search-bar__clear:hover {
  background: var(--color-bg);
}
</style>
