<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePokemonList } from '@/composables/usePokemonList'
import { useFavoritesStore } from '@/stores/favorites'
import PokemonGrid from '@/components/PokemonGrid.vue'
import PaginationControls from '@/components/PaginationControls.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

const route = useRoute()
const router = useRouter()

// The current page lives in the URL (?page=3), so reload and the back button keep it
const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value >= 1 ? value : 1
})
const { items, totalPages, loading, error, reload } = usePokemonList(page)

const favorites = useFavoritesStore()

function changePage(newPage: number) {
  router.push({ query: { ...route.query, page: newPage === 1 ? undefined : String(newPage) } })
}
</script>

<template>
  <h1 class="title">Pokédex</h1>

  <LoadingSpinner v-if="loading" />
  <ErrorMessage v-else-if="error" @retry="reload" />
  <template v-else>
    <PokemonGrid
      :pokemons="items"
      :is-favorite="favorites.isFavorite"
      @toggle-favorite="favorites.toggle"
    />
    <PaginationControls :page="page" :total-pages="totalPages" @change="changePage" />
  </template>
</template>

<style scoped>
.title {
  margin-bottom: var(--space-6);
}
</style>
