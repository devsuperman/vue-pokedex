<script setup lang="ts">
import EmptyState from '@/components/EmptyState.vue'
</script>

<template>
  <EmptyState title="Page not found">
    This page wandered into the tall grass.
    <template #actions>
      <RouterLink class="btn btn--primary" :to="{ name: 'home' }">Back to the Pokédex</RouterLink>
    </template>
  </EmptyState>
</template>
