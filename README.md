# vue-tasklist — Pokédex

Study project: learning Vue 3 by building a Pokédex on top of [PokéAPI](https://pokeapi.co/).

## Features

- Browse all Pokémon, 20 per page (page number kept in the URL)
- Search by name or number (`char`, `25`, `#025`); press Enter on an exact match to open it
- Details page: artwork, types, height, weight, abilities and base stats
- Mark favorites from any card or details page; they are saved in your browser
- Loading, error (with retry), empty and 404 states; works on phone and desktop

## Planning docs

1. [Business plan](docs/01-business-plan.md) — goals, scope, user stories
2. [Tech stack](docs/02-tech-stack.md) — tools, architecture, Vue concepts map
3. [Tasks](docs/03-tasks.md) — milestones and task checklist (with progress)
4. [Learning guide](docs/04-learning-guide.md) — study path through the Vue concepts used here, with exercises

## Run it

Requires Node.js `^22.18` or `>=24.12`.

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # type-check + production build
npm run test:unit  # unit tests in watch mode (npm test runs once)
npm run lint       # oxlint + eslint (auto-fix)
npm run format     # prettier
```

## Where to look for each Vue concept

| Concept | File |
|---|---|
| Props, emits, computed | `src/components/PokemonCard.vue`, `FavoriteButton.vue` |
| `v-for` + `:key` | `src/components/PokemonGrid.vue` |
| Slots | `src/components/EmptyState.vue` |
| `v-model` on a component (`defineModel`) | `src/components/SearchBar.vue` |
| Composables, `watch`, `MaybeRefOrGetter` | `src/composables/` |
| Pinia store + localStorage | `src/stores/favorites.ts` |
| Router: params as props, query, lazy routes, meta, `afterEach` | `src/router/index.ts` |
| URL ↔ state sync, `reactive()` unwrapping | `src/views/HomeView.vue` |
| API layer with cache | `src/api/pokeapi.ts` |
| Unit tests (stores, composables, components) | `src/**/__tests__/` |

## Deploy

`.github/workflows/deploy.yml` publishes to GitHub Pages on every push to `main`.
One-time setup: **Settings → Pages → Source: GitHub Actions**.
`.github/workflows/ci.yml` runs lint, format check, tests and build on every PR.

## What I learned

_Write a few lines per milestone here._
