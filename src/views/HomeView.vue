<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePokemonList } from '@/composables/usePokemonList'
import { usePokemonSearch } from '@/composables/usePokemonSearch'
import { useDebounce } from '@/composables/useDebounce'
import { useFavoritesStore } from '@/stores/favorites'
import PokemonGrid from '@/components/PokemonGrid.vue'
import PaginationControls from '@/components/PaginationControls.vue'
import SearchBar from '@/components/SearchBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import EmptyState from '@/components/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const favorites = useFavoritesStore()

// ----- Pagination: the current page lives in the URL (?page=3) -----
const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value >= 1 ? value : 1
})
// reactive() unwraps the refs inside, so the template can write `list.loading` instead of `list.loading.value`
const list = reactive(usePokemonList(page))

function changePage(newPage: number) {
  router.push({ query: { ...route.query, page: newPage === 1 ? undefined : String(newPage) } })
}

// ----- Search: the term also lives in the URL (?q=pika) -----
const queryFromRoute = () => (typeof route.query.q === 'string' ? route.query.q : '')
const searchInput = ref(queryFromRoute())
const searchTerm = useDebounce(searchInput, 300)
const isSearching = computed(() => searchTerm.value.trim().length > 0)
const search = reactive(usePokemonSearch(searchTerm))

// Input → URL (after the debounce). replace() so each keystroke doesn't add a history entry.
watch(searchTerm, (term) => {
  if (term === queryFromRoute()) return
  router.replace({ query: { q: term.trim() || undefined } })
})

// URL → input (e.g. the back button, or clicking "Home" while searching)
watch(queryFromRoute, (term) => {
  if (term !== searchTerm.value) searchInput.value = term
})

// Enter on an exact name/number jumps straight to the details page
function onSubmit() {
  const match = search.exactMatch
  if (match) router.push({ name: 'pokemon', params: { name: match.name } })
}
</script>

<template>
  <h1 class="visually-hidden">Pokédex</h1>
  <SearchBar v-model="searchInput" class="search" @submit="onSubmit" />

  <!-- Search results -->
  <template v-if="isSearching">
    <LoadingSpinner v-if="search.loading" label="Searching…" />
    <ErrorMessage v-else-if="search.error" @retry="search.reload" />
    <EmptyState v-else-if="search.results.length === 0" title="No Pokémon found">
      Nothing matches “{{ searchTerm }}”. Try another name or number.
    </EmptyState>
    <template v-else>
      <p class="summary" aria-live="polite">
        {{ search.totalMatches }} result{{ search.totalMatches === 1 ? '' : 's' }}
        <template v-if="search.totalMatches > search.results.length">
          — showing the first {{ search.results.length }}
        </template>
      </p>
      <PokemonGrid
        :pokemons="search.results"
        :is-favorite="favorites.isFavorite"
        @toggle-favorite="favorites.toggle"
      />
    </template>
  </template>

  <!-- Paginated list -->
  <template v-else>
    <LoadingSpinner v-if="list.loading" />
    <ErrorMessage v-else-if="list.error" @retry="list.reload" />
    <template v-else>
      <PokemonGrid
        :pokemons="list.items"
        :is-favorite="favorites.isFavorite"
        @toggle-favorite="favorites.toggle"
      />
      <PaginationControls :page="page" :total-pages="list.totalPages" @change="changePage" />
    </template>
  </template>
</template>

<style scoped>
.search {
  max-width: 560px;
  margin: 0 auto var(--space-6);
}

.summary {
  margin-bottom: var(--space-4);
  color: var(--color-text-muted);
}
</style>
