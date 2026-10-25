<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="container main">
    <RouterView />
  </main>
</template>

<style scoped>
.main {
  padding-top: var(--space-6);
  padding-bottom: var(--space-8);
}
</style>
