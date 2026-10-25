<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), {
  message: 'Something went wrong while loading data.',
})

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="error-message" role="alert">
    <p>{{ message }}</p>
    <button type="button" class="btn btn--primary" @click="emit('retry')">Try again</button>
  </div>
</template>

<style scoped>
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-8) var(--space-4);
  border: 1px solid #f3c2b6;
  border-radius: var(--radius-md);
  background: #fff4f1;
  text-align: center;
}
</style>
