# 03 — Development Tasks

Tasks are grouped by milestone. Each milestone introduces a small set of Vue
concepts (🎓) so learning happens one step at a time. Check items off as you go.
Story ids (US1…) refer to [01-business-plan.md](./01-business-plan.md).

---

## M0 — Project setup

🎓 Vite, project structure, SFC basics, DevTools

- [ ] T0.1 Scaffold with `npm create vue@latest` (TypeScript, Router, Pinia, Vitest, ESLint, Prettier)
- [ ] T0.2 Remove the demo components/views; keep an empty `App.vue`
- [ ] T0.3 Create the folder structure from the tech stack doc
- [ ] T0.4 Install Vue DevTools in the browser; check the app runs (`npm run dev`)
- [ ] T0.5 Add base CSS: reset, CSS variables (colors, spacing), font
- [ ] T0.6 Update README with run instructions
- **Done when:** `dev`, `build`, `lint` and `test:unit` all run without errors.

## M1 — Static UI with components

🎓 Template syntax, props, emits, `v-for`, `:key`, slots, scoped styles, class binding

- [ ] T1.1 `AppHeader` with app title and links (Home, Favorites) — plain `<a>` for now
- [ ] T1.2 `PokemonCard` — props `pokemon: PokemonSummary`; shows image, `#001`, name
- [ ] T1.3 `PokemonGrid` — renders a list of cards with `v-for`; use 3–4 hard-coded Pokémon
- [ ] T1.4 `TypeBadge` — prop `type`; background color via a class/style binding per type
- [ ] T1.5 `FavoriteButton` — prop `active`, emits `toggle`; heart icon filled/empty
- [ ] T1.6 `utils/format.ts` — `padId(25) → "#025"`, `idFromUrl(url)`, `artworkUrl(id)`, unit converters
- [ ] T1.7 Responsive CSS grid for the cards
- **Done when:** a static grid of cards renders, favorite button toggles a local `ref` and the parent logs the emitted event.

## M2 — Fetch the list from PokéAPI (US1, US2)

🎓 `ref`, `onMounted`, async/await, `v-if`/`v-else`, composables, `computed`

- [ ] T2.1 `types/pokemon.ts` — API types
- [ ] T2.2 `api/pokeapi.ts` — `getPokemonList(limit, offset)` and `getPokemon(nameOrId)` with `fetch`, error on `!res.ok`, in-memory `Map` cache
- [ ] T2.3 `usePokemonList()` composable — exposes `items`, `loading`, `error`, `page`, `totalPages`, `next()`, `prev()`, `load()`
- [ ] T2.4 Map list results to `PokemonSummary` (id from URL, artwork URL)
- [ ] T2.5 `LoadingSpinner` and `ErrorMessage` (with "Try again" emitting `retry`)
- [ ] T2.6 `PaginationControls` — Prev / Next, disabled at edges, "Page X of Y"
- [ ] T2.7 `HomeView` uses the composable + grid + states
- [ ] T2.8 Lazy image loading (`loading="lazy"`) and fallback image on error
- **Done when:** the first 20 Pokémon load from the API, pages change, loading and error states are visible (test error by going offline in DevTools).

## M3 — Routing and details page (US4, US7)

🎓 Vue Router, `RouterLink`, `RouterView`, route params & query, `watch`, lazy routes

- [ ] T3.1 Configure routes: `/`, `/pokemon/:name`, `/favorites`, catch-all 404
- [ ] T3.2 Replace header `<a>` with `RouterLink`; style the active link
- [ ] T3.3 Cards link to `/pokemon/:name`
- [ ] T3.4 Keep current page in the URL (`?page=N`); read it on load, update it on change
- [ ] T3.5 `usePokemon(name)` composable; `watch` the route param so it refetches when it changes
- [ ] T3.6 `PokemonDetailView`: big image, number, name, types, height (m), weight (kg), abilities
- [ ] T3.7 `StatBar` component — stat name, value, width bound via `:style`
- [ ] T3.8 Back button (`router.back()`) returns to the same list page
- [ ] T3.9 `NotFoundView`; details page shows "Pokémon not found" for a 404 from the API
- [ ] T3.10 Lazy-load details/favorites views (`() => import(...)`)
- **Done when:** clicking a card opens its details, reload on a details URL works, back keeps the page number, unknown URLs show 404.

## M4 — Favorites (US5, US6)

🎓 Pinia (state, getters, actions), `storeToRefs`, `watch` with `deep`, `localStorage`

- [ ] T4.1 `stores/favorites.ts` — state `items`; getters `count`, `isFavorite(id)`; actions `add`, `remove`, `toggle`
- [ ] T4.2 Load initial state from `localStorage` (guarded with try/catch); `watch` the state and save on change
- [ ] T4.3 Connect `FavoriteButton` on cards and details page to the store
- [ ] T4.4 Favorite count badge in `AppHeader`
- [ ] T4.5 `FavoritesView` — grid of favorites, empty state with link to Home
- [ ] T4.6 Inspect the store in Vue DevTools
- **Done when:** toggling on any page updates every view instantly and favorites survive a reload.

## M5 — Search & polish (US3, US7)

🎓 `v-model`, debounced `watch`, `computed` filtering, custom composable

- [ ] T5.1 `SearchBar` component using `v-model` (`defineModel`)
- [ ] T5.2 `useDebounce` composable (300 ms)
- [ ] T5.3 Fetch the full name list once (`/pokemon?limit=100000`), cache it
- [ ] T5.4 `computed` filtered results by name substring or number; show results grid instead of pagination while searching
- [ ] T5.5 Keep search term in the URL (`?q=pika`)
- [ ] T5.6 "No Pokémon found" empty state
- [ ] T5.7 Accessibility pass: alt texts, button labels (`aria-pressed` on favorite), focus styles, color contrast
- [ ] T5.8 Page titles per route (`router.afterEach` → `document.title`)
- **Done when:** typing "char" shows Charmander/Charmeleon/Charizard…; "25" shows Pikachu; no console errors.

## M6 — Tests & deploy

🎓 Testing components and stores, CI

- [ ] T6.1 Unit tests for `utils/format.ts`
- [ ] T6.2 Unit tests for the favorites store (toggle, persistence with mocked `localStorage`)
- [ ] T6.3 Unit tests for `usePokemonList` with mocked `fetch` (success, error, pagination)
- [ ] T6.4 Component tests: `PokemonCard` renders props and emits; `FavoriteButton`; `ErrorMessage` retry
- [ ] T6.5 *(Optional)* Playwright E2E: open list → open details → favorite → see it on Favorites page
- [ ] T6.6 GitHub Actions workflow: lint + test + build on every push/PR
- [ ] T6.7 Deploy to GitHub Pages (set Vite `base`, use `createWebHashHistory` or a 404.html fallback)
- [ ] T6.8 README: features, screenshots, live link, "What I learned"
- **Done when:** CI is green and the app is reachable at a public URL.

## M7 — Nice to have (pick any)

- [ ] T7.1 Filter by type (`/type/{name}`) with a type selector
- [ ] T7.2 Previous / next Pokémon arrows on details page
- [ ] T7.3 Description + genus from `/pokemon-species/{id}`
- [ ] T7.4 Evolution chain
- [ ] T7.5 `<Transition>` / `<TransitionGroup>` animations
- [ ] T7.6 Dark mode with a toggle (persisted)
- [ ] T7.7 Infinite scroll with `IntersectionObserver` in a composable
- [ ] T7.8 Skeleton loaders instead of spinner
- [ ] T7.9 Persist API cache in `localStorage` / `sessionStorage`

---

## Suggested order & rough effort

| Milestone | Effort (study pace) |
|---|---|
| M0 Setup | 1–2 h |
| M1 Static UI | 3–4 h |
| M2 List from API | 4–6 h |
| M3 Routing + details | 4–6 h |
| M4 Favorites | 3–4 h |
| M5 Search & polish | 4–5 h |
| M6 Tests & deploy | 4–6 h |
| M7 Extras | open |

Tip: after each milestone, write 3–5 lines in a `LEARNINGS.md` about what was
new — it becomes the "What I learned" section of the README.
