<script setup lang="ts">
defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <nav class="pagination" aria-label="Pagination">
    <button
      type="button"
      class="btn"
      :disabled="page <= 1"
      aria-label="Previous page"
      @click="emit('change', page - 1)"
    >
      ← Previous
    </button>
    <span class="pagination__status" aria-live="polite">Page {{ page }} of {{ totalPages }}</span>
    <button
      type="button"
      class="btn"
      :disabled="page >= totalPages"
      aria-label="Next page"
      @click="emit('change', page + 1)"
    >
      Next →
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-top: var(--space-8);
}

.pagination__status {
  color: var(--color-text-muted);
  font-weight: 600;
}
</style>
