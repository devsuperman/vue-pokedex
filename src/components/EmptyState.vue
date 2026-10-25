<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<!-- Slots let the parent decide the message (default slot) and the buttons (#actions slot) -->
<template>
  <section class="empty-state">
    <img src="@/assets/pokeball.svg" alt="" width="72" height="72" />
    <h2>{{ title }}</h2>
    <div class="empty-state__body">
      <slot />
    </div>
    <div v-if="$slots.actions" class="empty-state__actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-8) var(--space-4);
  text-align: center;
}

.empty-state__body {
  max-width: 40ch;
  color: var(--color-text-muted);
}

.empty-state__actions {
  margin-top: var(--space-2);
}
</style>
