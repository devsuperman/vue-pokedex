# 02 — Tech Stack

The stack follows what the official Vue docs recommend today, so what I learn
here transfers directly to real projects. Each tool is added only when a
milestone needs it.

## 1. Overview

| Layer | Choice | Why |
|---|---|---|
| Framework | **Vue 3** with **Composition API** and `<script setup>` | Current standard style; what the official docs teach first |
| Language | **TypeScript** (light usage) | Types for API responses catch mistakes early; can start with plain JS if preferred |
| Build tool / dev server | **Vite** | Official tooling, instant HMR; scaffolded with `npm create vue@latest` |
| Routing | **Vue Router 4** | List, details, favorites and 404 pages |
| State management | **Pinia** | Official store; holds favorites (and caches) shared across pages |
| HTTP | Native **`fetch`** wrapped in a small API module | No extra dependency; learn async handling directly |
| Persistence | **`localStorage`** | Favorites survive reloads; no backend needed |
| Styling | Plain **CSS** with scoped styles + CSS variables | Learn Vue's `<style scoped>`; no framework to learn at the same time. (Optional later: Tailwind) |
| Unit tests | **Vitest** + **Vue Test Utils** | Vite-native test runner; official component testing library |
| E2E tests *(optional)* | **Playwright** | One happy-path test: list → details → favorite |
| Lint / format | **ESLint** (`eslint-plugin-vue`) + **Prettier** | Offered by `create-vue`; consistent code |
| Dev tools | **Vue DevTools** browser extension | Inspect components, Pinia state, router |
| Deploy | **GitHub Pages** (via GitHub Actions) or Netlify/Vercel | Free static hosting |
| Node | Node.js 20 LTS or newer | Required by Vite |

Scaffold command (pick: TypeScript, Router, Pinia, Vitest, ESLint, Prettier):

```bash
npm create vue@latest
```

## 2. Learning map — Vue concept → where it is used

| Vue concept | Where in the Pokédex |
|---|---|
| Single-File Components (`.vue`) | Every component |
| Template syntax, `v-bind`, `v-on`, interpolation | Cards, buttons, images |
| `v-for` with `:key` | Rendering the list grid, types, stats |
| `v-if` / `v-else` / `v-show` | Loading / error / empty states |
| `v-model` | Search input |
| `ref` / `reactive` | Page number, loading flag, fetched data |
| `computed` | Formatted number (`#025`), height in m, filtered search results, `isFavorite` |
| `watch` / `watchEffect` | Refetch when route param or page changes; debounce search |
| Lifecycle hooks (`onMounted`) | Initial data fetch |
| Props & emits | `PokemonCard` receives a Pokémon, emits `toggle-favorite` |
| Slots | Generic `BaseCard` / `AppLayout` |
| Dynamic class & style binding | Type color badges, stat bar widths |
| Composables (`useXxx`) | `usePokemonList`, `usePokemon`, `useDebounce` |
| Vue Router: routes, params, query, `RouterLink`, navigation, 404 | `/`, `/pokemon/:name`, `/favorites`, catch-all |
| Lazy-loaded routes | Details and favorites pages |
| Pinia: state, getters, actions | `favorites` store |
| Pinia + persistence | Sync store to `localStorage` with `watch` |
| `<Transition>` / `<TransitionGroup>` *(nice to have)* | Card hover/enter, favorites list |
| Async components & `<Suspense>` *(optional)* | Details page |
| Testing components & stores | Vitest + Vue Test Utils |

## 3. Folder structure

```
src/
├── api/
│   └── pokeapi.ts           # fetch wrappers + in-memory cache
├── types/
│   └── pokemon.ts           # TypeScript types for API responses
├── composables/
│   ├── usePokemonList.ts    # pagination, loading, error
│   ├── usePokemon.ts        # one Pokémon's details
│   └── useDebounce.ts
├── stores/
│   └── favorites.ts         # Pinia store, persisted to localStorage
├── components/
│   ├── AppHeader.vue
│   ├── PokemonCard.vue
│   ├── PokemonGrid.vue
│   ├── TypeBadge.vue
│   ├── StatBar.vue
│   ├── FavoriteButton.vue
│   ├── SearchBar.vue
│   ├── PaginationControls.vue
│   ├── LoadingSpinner.vue
│   └── ErrorMessage.vue
├── views/
│   ├── HomeView.vue         # list + search
│   ├── PokemonDetailView.vue
│   ├── FavoritesView.vue
│   └── NotFoundView.vue
├── router/
│   └── index.ts
├── utils/
│   └── format.ts            # padId, units, id-from-url
├── App.vue
└── main.ts
```

## 4. Architecture

```
 Views (pages) ──use──▶ Composables ──call──▶ api/pokeapi.ts ──fetch──▶ PokéAPI
     │                                              │
     │                                         in-memory cache (Map)
     ├──use──▶ Pinia favorites store ◀──sync──▶ localStorage
     │
     └──render──▶ Presentational components (props in, events out)
```

Rules:
- **Components** are presentational: receive data via props, emit events, no fetching.
- **Views** compose components and use composables/stores.
- **Composables** hold reusable stateful logic (loading, error, data).
- **API module** is the only place that knows URLs; it returns typed data.

## 5. Routes

| Path | View | Notes |
|---|---|---|
| `/` | `HomeView` | `?page=N` and `?q=term` in the query string |
| `/pokemon/:name` | `PokemonDetailView` | Lazy loaded; `:name` accepts name or id |
| `/favorites` | `FavoritesView` | Lazy loaded |
| `/:pathMatch(.*)*` | `NotFoundView` | 404 |

## 6. Data model

```ts
// List item (from /pokemon?limit&offset)
interface PokemonListItem { name: string; url: string }

// What the UI uses for cards
interface PokemonSummary { id: number; name: string; image: string }

// Details (subset of /pokemon/{id})
interface PokemonDetail {
  id: number
  name: string
  height: number   // decimetres → divide by 10 for metres
  weight: number   // hectograms → divide by 10 for kg
  types: { slot: number; type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  abilities: { ability: { name: string }; is_hidden: boolean }[]
  sprites: { other: { 'official-artwork': { front_default: string | null } } }
}

// Favorites store state
interface FavoritesState { items: PokemonSummary[] }   // saved as JSON in localStorage key "pokedex:favorites"
```

Storing the `PokemonSummary` (not just the id) lets the favorites page render
without any API call.

## 7. Conventions

- Components in `PascalCase.vue`, composables `useCamelCase.ts`.
- `<script setup lang="ts">` everywhere; `defineProps` / `defineEmits` with types.
- Conventional commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).
- One branch / PR per milestone.
- Scripts: `npm run dev`, `npm run build`, `npm run test:unit`, `npm run lint`.
