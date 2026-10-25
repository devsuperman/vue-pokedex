<script setup lang="ts">
defineProps<{ type: string }>()
</script>

<template>
  <!-- Dynamic style binding: each type gets its own color from a CSS variable -->
  <span class="type-badge" :style="{ '--type-color': `var(--type-${type}, var(--type-unknown))` }">
    {{ type }}
  </span>
</template>

<style scoped>
.type-badge {
  display: inline-block;
  padding: 2px var(--space-3);
  border-radius: 999px;
  background: var(--type-color);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  text-shadow: 0 1px 1px rgb(0 0 0 / 35%);
}
</style>
