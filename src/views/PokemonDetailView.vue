<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { NotFoundError } from '@/api/pokeapi'
import { usePokemon } from '@/composables/usePokemon'
import {
  artworkUrl,
  formatHeight,
  formatName,
  formatStatName,
  formatWeight,
  padId,
} from '@/utils/format'
import TypeBadge from '@/components/TypeBadge.vue'
import StatBar from '@/components/StatBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import EmptyState from '@/components/EmptyState.vue'

// Comes from the route param thanks to `props: true` in the router
const props = defineProps<{ name: string }>()

const router = useRouter()
const { pokemon, loading, error, reload } = usePokemon(() => props.name)

const notFound = computed(() => error.value instanceof NotFoundError)
const displayName = computed(() => (pokemon.value ? formatName(pokemon.value.name) : ''))
const image = computed(() => {
  if (!pokemon.value) return ''
  return (
    pokemon.value.sprites.other?.['official-artwork']?.front_default ??
    pokemon.value.sprites.front_default ??
    artworkUrl(pokemon.value.id)
  )
})
const types = computed(() => pokemon.value?.types.map((t) => t.type.name) ?? [])
const mainType = computed(() => types.value[0] ?? 'unknown')
const totalStats = computed(
  () => pokemon.value?.stats.reduce((sum, s) => sum + s.base_stat, 0) ?? 0,
)

function goBack() {
  // Vue Router keeps the previous location in history.state.back.
  // If the user opened this URL directly there is nothing to go back to.
  if (window.history.state?.back) router.back()
  else router.push({ name: 'home' })
}
</script>

<template>
  <button type="button" class="btn back" @click="goBack">← Back</button>

  <LoadingSpinner v-if="loading" />

  <EmptyState v-else-if="notFound" title="Pokémon not found">
    We couldn't find a Pokémon called “{{ name }}”.
    <template #actions>
      <RouterLink class="btn btn--primary" :to="{ name: 'home' }">See all Pokémon</RouterLink>
    </template>
  </EmptyState>

  <ErrorMessage v-else-if="error" @retry="reload" />

  <article v-else-if="pokemon" class="detail" :style="{ '--accent': `var(--type-${mainType})` }">
    <header class="detail__hero">
      <img class="detail__image" :src="image" :alt="displayName" width="320" height="320" />
      <div class="detail__heading">
        <span class="detail__number">{{ padId(pokemon.id) }}</span>
        <h1 class="detail__name">{{ displayName }}</h1>
        <div class="detail__types">
          <TypeBadge v-for="type in types" :key="type" :type="type" />
        </div>
      </div>
    </header>

    <div class="detail__body">
      <section class="panel">
        <h2>About</h2>
        <dl class="facts">
          <div>
            <dt>Height</dt>
            <dd>{{ formatHeight(pokemon.height) }}</dd>
          </div>
          <div>
            <dt>Weight</dt>
            <dd>{{ formatWeight(pokemon.weight) }}</dd>
          </div>
        </dl>
        <h3>Abilities</h3>
        <ul class="abilities">
          <li v-for="a in pokemon.abilities" :key="a.ability.name">
            {{ formatName(a.ability.name) }}
            <small v-if="a.is_hidden">(hidden)</small>
          </li>
        </ul>
      </section>

      <section class="panel">
        <h2>Base stats</h2>
        <div class="stats">
          <StatBar
            v-for="s in pokemon.stats"
            :key="s.stat.name"
            :label="formatStatName(s.stat.name)"
            :value="s.base_stat"
          />
        </div>
        <p class="stats__total">
          Total <strong>{{ totalStats }}</strong>
        </p>
      </section>
    </div>
  </article>
</template>

<style scoped>
.back {
  margin-bottom: var(--space-4);
}

.detail {
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.detail__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-4);
  background: linear-gradient(160deg, color-mix(in srgb, var(--accent) 35%, white), white);
  text-align: center;
}

.detail__image {
  width: 100%;
  max-width: 280px;
  height: auto;
  aspect-ratio: 1;
  object-fit: contain;
  filter: drop-shadow(0 8px 12px rgb(0 0 0 / 18%));
}

.detail__number {
  color: var(--color-text-muted);
  font-size: 1.1rem;
  font-weight: 700;
}

.detail__name {
  font-size: clamp(1.8rem, 6vw, 2.6rem);
  line-height: 1.1;
}

.detail__types {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.detail__body {
  display: grid;
  gap: var(--space-6);
  padding: var(--space-6) var(--space-4);
}

.panel h2 {
  margin-bottom: var(--space-3);
  font-size: 1.2rem;
}

.panel h3 {
  margin: var(--space-4) 0 var(--space-2);
  font-size: 1rem;
}

.facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.facts div {
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
}

.facts dt {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.facts dd {
  font-size: 1.15rem;
  font-weight: 700;
}

.abilities {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: 0;
  list-style: none;
}

.abilities li {
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: 999px;
}

.abilities small {
  color: var(--color-text-muted);
}

.stats {
  display: grid;
  gap: var(--space-2);
}

.stats__total {
  margin-top: var(--space-3);
  color: var(--color-text-muted);
  text-align: right;
}

.stats__total strong {
  color: var(--color-text);
}

@media (min-width: 768px) {
  .detail__hero {
    flex-direction: row;
    justify-content: center;
    gap: var(--space-8);
    text-align: left;
  }

  .detail__types {
    justify-content: flex-start;
  }

  .detail__body {
    grid-template-columns: 1fr 1fr;
    padding: var(--space-8);
  }
}
</style>
