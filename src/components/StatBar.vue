<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    value: number
    /** Highest base stat in the games is 255 */
    max?: number
  }>(),
  { max: 255 },
)

const percent = computed(() => Math.min(100, Math.round((props.value / props.max) * 100)))
const level = computed(() => (props.value >= 100 ? 'high' : props.value >= 60 ? 'mid' : 'low'))
</script>

<template>
  <div class="stat-bar">
    <span class="stat-bar__label">{{ label }}</span>
    <span class="stat-bar__value">{{ value }}</span>
    <div
      class="stat-bar__track"
      role="meter"
      :aria-label="label"
      :aria-valuenow="value"
      aria-valuemin="0"
      :aria-valuemax="max"
    >
      <div
        class="stat-bar__fill"
        :class="`stat-bar__fill--${level}`"
        :style="{ width: `${percent}%` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.stat-bar {
  display: grid;
  grid-template-columns: 5.5rem 2.5rem 1fr;
  align-items: center;
  gap: var(--space-3);
}

.stat-bar__label {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-weight: 600;
}

.stat-bar__value {
  font-weight: 700;
  text-align: right;
}

.stat-bar__track {
  height: 10px;
  border-radius: 999px;
  background: var(--color-bg);
  overflow: hidden;
}

.stat-bar__fill {
  height: 100%;
  border-radius: inherit;
  transition: width 0.4s ease-out;
}

.stat-bar__fill--low {
  background: #f08a5d;
}

.stat-bar__fill--mid {
  background: #f7c948;
}

.stat-bar__fill--high {
  background: #5cb85c;
}
</style>
