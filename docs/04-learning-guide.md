# 04 — Vue Learning Guide

A study path through the Vue concepts used in this project, from the basics to
testing and deployment. Every module points at real files in the repo, so you
learn each concept from working code instead of a toy example.

The modules follow the order the app was built (milestones M0–M6 in
[03-tasks.md](./03-tasks.md)). Each one names a **checkpoint commit**: running
`git checkout <sha>` shows the app with only the concepts covered so far.
Run `git checkout main` to come back.

---

## How to study each module

1. **Read** the listed files in order. The comments in the code explain the "why".
2. **Run** the app (`npm run dev`) and open Vue DevTools (Alt+Shift+D) to inspect
   components, props, Pinia state and routes while you click around.
3. **Do the exercise** on a branch of your own. Then compare your answer with the
   solution notes. They are hidden in a collapsed block, so try first.
4. **Check** your work with `npm run type-check`, `npm run lint` and `npm test`.

Suggested pace: about two weeks at one hour a day.

| Module | Topic                          | Time     |
| ------ | ------------------------------ | -------- |
| 0      | Project anatomy                | ½ day    |
| 1      | Template syntax and components | 1–2 days |
| 2      | Reactivity and data fetching   | 1 day    |
| 3      | Composables                    | 2–3 days |
| 4      | Vue Router                     | 2 days   |
| 5      | State management with Pinia    | 1 day    |
| 6      | Forms and component `v-model`  | 1 day    |
| 7      | Testing                        | 1–2 days |
| 8      | Tooling and shipping           | ½ day    |

---

## Module 0: Project anatomy

**Checkpoint:** `03e1ce3`

### Concepts

- **Vite**: the dev server and bundler. It compiles `.vue` files and supports instant hot reload.
- **Single-File Components (SFC)**: one `.vue` file holds three blocks:
  - `<script setup lang="ts">` for the logic
  - `<template>` for the markup
  - `<style scoped>` for CSS that applies only to this component
- **`createApp(App)`**: creates the application.
- **`app.use()`**: installs plugins, here Pinia and the router.
- **`app.mount('#app')`**: attaches the app to `index.html`.
- **The `@/` alias**: points to `src/`. It is configured in `vite.config.ts` and `tsconfig.app.json`.
- **`import.meta.env`**: holds build-time variables such as `BASE_URL`.

### Read

- [`index.html`](../index.html): the `<div id="app">` element that Vue takes over
- [`src/main.ts`](../src/main.ts)
- [`src/App.vue`](../src/App.vue): the root component, a header plus `<RouterView />`
- [`vite.config.ts`](../vite.config.ts)
- [`src/assets/main.css`](../src/assets/main.css): global styles and the CSS variables
  (design tokens) that the components use

### Exercise

Comment out `app.use(router)` in `main.ts`, reload the page and read the console
error. Why does the app break, and which components depend on the router?

<details>
<summary>Solution notes</summary>

`<RouterView>` and `<RouterLink>` are registered globally by the router plugin.
Without it, Vue warns that it cannot resolve these components, and the pages
never render. `App.vue`, `AppHeader.vue`, `PokemonCard.vue` and every view that
uses `useRoute()` / `useRouter()` depend on the router. Those functions read
from the router instance that `app.use(router)` provides.

</details>

---

## Module 1: Template syntax and components

**Checkpoint:** `328cab8`

### Concepts

- **Interpolation**: `{{ expression }}` prints a value as text.
- **Attribute binding**: `:attr="expr"` is short for `v-bind`. Two special cases:
  - `:class` with object syntax: `{ 'favorite-button--active': active }`
  - `:style` with CSS custom properties: `{ '--type-color': ... }`
- **Lists**: `v-for="item in items"` with a unique `:key`, so Vue can track
  each item when the list changes.
- **Events**: `@click="..."` is short for `v-on`.
- **Props**, data passed from parent to child:
  - `defineProps<T>()` with a TypeScript type
  - `withDefaults()` to give optional props a default value
- **Emits**, events sent from child to parent:
  - `defineEmits<T>()` with typed payloads, e.g. `{ 'toggle-favorite': [pokemon: PokemonSummary] }`
  - Re-emitting a child's event to the parent with `$event`
- **Slots**, content passed into a component:
  - The default `<slot />`
  - Named slots (`<slot name="actions" />`, filled with `<template #actions>`)
  - `$slots.actions` to render a wrapper only when the slot is used
- **Scoped styles**: CSS in `<style scoped>` only affects this component.
- **Static assets**: `import fallbackImage from '@/assets/pokeball.svg'` and
  `src="@/assets/..."` in templates.

### Read (in this order)

1. [`TypeBadge.vue`](../src/components/TypeBadge.vue): a single prop and a dynamic style
2. [`FavoriteButton.vue`](../src/components/FavoriteButton.vue): class binding, a
   `computed` label, ARIA attributes and an emit
3. [`StatBar.vue`](../src/components/StatBar.vue): `withDefaults` and a computed class name
4. [`PokemonCard.vue`](../src/components/PokemonCard.vue): composing child components and
   the `@error` event on `<img>`
5. [`PokemonGrid.vue`](../src/components/PokemonGrid.vue): `v-for` + `:key`, and passing a
   function as a prop (`isFavorite`)
6. [`EmptyState.vue`](../src/components/EmptyState.vue): the default slot, a named slot and
   `$slots`
7. [`src/utils/format.ts`](../src/utils/format.ts): plain TypeScript helpers. Keep logic
   out of templates whenever you can.

### Exercise

Add an optional `size` prop (`'sm' | 'lg'`, default `'sm'`) to `TypeBadge`.
Make the detail page use `size="lg"`.

<details>
<summary>Solution notes</summary>

```vue
<script setup lang="ts">
withDefaults(defineProps<{ type: string; size?: 'sm' | 'lg' }>(), { size: 'sm' })
</script>

<template>
  <span
    class="type-badge"
    :class="`type-badge--${size}`"
    :style="{ '--type-color': `var(--type-${type}, var(--type-unknown))` }"
  >
    {{ type }}
  </span>
</template>

<style scoped>
/* ...existing styles... */
.type-badge--lg {
  padding: 4px var(--space-4);
  font-size: 0.9rem;
}
</style>
```

In `PokemonDetailView.vue`: `<TypeBadge v-for="type in types" :key="type" :type="type" size="lg" />`.
Pass `size="lg"` without a colon because it is a static string. Use `:size="..."`
only when the value comes from a JavaScript expression.

</details>

---

## Module 2: Reactivity and data fetching

**Checkpoint:** `2065e86`

### Concepts

- **`ref()`**: a reactive box. Read and write it with `.value` in `<script>`.
  Templates unwrap it automatically.
- **`computed()`**: a value derived from other reactive values. It is cached and
  recalculated only when its dependencies change.
- **Conditional rendering**:
  - `v-if` / `v-else-if` / `v-else` chains
  - `<template v-if>` to group elements without adding an extra DOM node
- **Async states**: every request has a `loading`, an `error` and a data state,
  and the UI shows exactly one of them.
- **An API layer**: components never call `fetch` directly. The
  [`api/pokeapi.ts`](../src/api/pokeapi.ts) module contains:
  - typed functions
  - a custom `NotFoundError` class, so views can tell "not found" apart from "network failed"
  - an in-memory cache of promises
- **TypeScript types for API responses**: [`src/types/pokemon.ts`](../src/types/pokemon.ts).

### Read

- [`src/types/pokemon.ts`](../src/types/pokemon.ts)
- [`src/api/pokeapi.ts`](../src/api/pokeapi.ts)
- [`LoadingSpinner.vue`](../src/components/LoadingSpinner.vue) and
  [`ErrorMessage.vue`](../src/components/ErrorMessage.vue): reusable state components
- The `v-if` chain at the bottom of [`HomeView.vue`](../src/views/HomeView.vue)

### Exercise

Answer these questions about `api/pokeapi.ts`:

1. Why does the cache store the **promise** instead of the resolved data?
2. What would go wrong without `promise.catch(() => cache.delete(url))`?
3. Why is `instanceof NotFoundError` more reliable than checking the error message text?

<details>
<summary>Solution notes</summary>

1. Two components can ask for the same URL before the first request finishes.
   With the promise in the cache, the second caller gets the same in-flight
   promise, so only one HTTP request is sent. A cache of resolved data would
   still let both callers start a request.
2. A failed request would stay in the cache forever. Every "Try again" click
   would get the same rejected promise back, and the app would never retry.
3. Messages are free text and can change, or be translated. A class is a real
   type that TypeScript and `instanceof` can check. It also carries its meaning
   ("show the not-found screen") explicitly.

</details>

---

## Module 3: Composables

**Checkpoints:** `2065e86` (list), `90ea880` (single Pokémon), `91b221f` (search and debounce)

This is the most important module. Composables are how Vue 3 shares stateful
logic between components.

### Concepts

- **The `useX()` pattern**: a function that creates refs, computeds and
  watchers, and returns them. Every component that calls it gets its own copy.
- **`watch(source, callback, options)`**:
  - Watching a ref, or a getter such as `() => toValue(page)`
  - `{ immediate: true }` runs the callback once right away, like `onMounted`,
    and again on every change
  - `{ deep: true }` also reacts to mutations inside arrays and objects
- **`MaybeRefOrGetter<T>` + `toValue()`**: lets a composable accept a plain value,
  a ref or a getter. This is how `usePokemon(() => props.name)` reacts to prop
  changes.
- **Race conditions**: when the user changes page quickly, an older response can
  arrive after a newer one. The `lastRequest` counter ignores stale answers.
- **`shallowRef()`**: for big data that is replaced as a whole. Vue does not make
  every nested item reactive (see `usePokemonSearch`).
- **Cleanup with `onScopeDispose()`**: clears timers when the component that uses
  the composable is unmounted (see `useDebounce`).
- **`reactive(useX())`**: wraps the returned object so the template can write
  `list.loading` instead of `list.loading.value`.
- **Destructuring, the other style**: `const { pokemon, loading } = usePokemon(...)`
  keeps the refs, which also stay reactive.

### Read (simplest first)

1. [`useDebounce.ts`](../src/composables/useDebounce.ts): `watch`, a timer and cleanup
2. [`usePokemon.ts`](../src/composables/usePokemon.ts): async loading, `toValue` and the
   race guard
3. [`usePokemonList.ts`](../src/composables/usePokemonList.ts): adds pagination and a
   `computed` for `totalPages`
4. [`usePokemonSearch.ts`](../src/composables/usePokemonSearch.ts): lazy loading,
   `shallowRef` and chained computeds
5. How they are combined in [`HomeView.vue`](../src/views/HomeView.vue) and
   [`PokemonDetailView.vue`](../src/views/PokemonDetailView.vue)

### Exercise

Write a `useLocalStorage<T>(key, defaultValue)` composable. It returns a ref
that starts with the saved value and saves every change. Use it in `HomeView`
to show a "Last search: _pikachu_" link under the search bar.

<details>
<summary>Solution notes</summary>

```ts
// src/composables/useLocalStorage.ts
import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  function read(): T {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? defaultValue : (JSON.parse(raw) as T)
    } catch {
      return defaultValue
    }
  }

  const state = ref(read()) as Ref<T>

  watch(
    state,
    (value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // Storage blocked: keep working in memory
      }
    },
    { deep: true },
  )

  return state
}
```

In `HomeView.vue`:

```ts
const lastSearch = useLocalStorage('pokedex:last-search', '')
watch(searchTerm, (term) => {
  if (term.trim()) lastSearch.value = term.trim()
})
```

```vue
<p v-if="!isSearching && lastSearch">
  Last search:
  <RouterLink :to="{ query: { q: lastSearch } }">{{ lastSearch }}</RouterLink>
</p>
```

Compare your version with the persistence logic in
[`stores/favorites.ts`](../src/stores/favorites.ts). It follows the same idea.

</details>

---

## Module 4: Vue Router

**Checkpoint:** `90ea880` (routes and details page), `91b221f` (search in the URL, page titles)

### Concepts

- **Setup**: `createRouter` with `createWebHistory(import.meta.env.BASE_URL)`,
  which gives clean URLs that also work under the GitHub Pages sub-path.
- **Route types**:
  - Named routes: navigate with `{ name: 'pokemon', params: { name } }`
    instead of building path strings
  - Dynamic params: `/pokemon/:name`
  - `props: true` passes the param to the view as a prop, so the view does not
    depend on `useRoute()`
  - Catch-all 404: `/:pathMatch(.*)*`
- **Lazy-loaded routes**: `component: () => import('...')` makes Vite split
  that view into its own file, which is downloaded on first visit.
- **`<RouterView>`**: renders the current page.
- **`<RouterLink>`**: renders links and adds the `router-link-exact-active`
  class on the current page (see the `AppHeader` styles).
- **`useRoute()` and `useRouter()`**:
  - `useRoute()` reads the current location
  - `useRouter()` navigates: `push` adds a history entry, `replace` changes the
    current one, and `back` goes back
- **State in the URL**: `?page=3` and `?q=pika` make the page shareable and
  make the back button work.
  - `HomeView` syncs input → URL and URL → input with two watchers.
- **Router extras**:
  - `scrollBehavior` restores the scroll position when going back
  - `router.afterEach` is a global hook that sets `document.title`
  - Module augmentation (`declare module 'vue-router'`) types the custom
    `meta.title` field

### Read

- [`src/router/index.ts`](../src/router/index.ts)
- [`AppHeader.vue`](../src/components/AppHeader.vue): `RouterLink` and the active class
- [`PokemonDetailView.vue`](../src/views/PokemonDetailView.vue): a route param received as a
  prop, and `goBack()`
- [`HomeView.vue`](../src/views/HomeView.vue): the `page` computed from `route.query`,
  `changePage`, and the two search watchers
- [`NotFoundView.vue`](../src/views/NotFoundView.vue)

### Exercise

Add a `/type/:type` page that lists every Pokémon of one type. Turn each
`TypeBadge` on the details page into a link to it. PokéAPI endpoint:
`GET /type/{name}` returns `{ pokemon: { pokemon: { name, url } }[] }`.

<details>
<summary>Solution notes</summary>

1. API, in `api/pokeapi.ts`:

   ```ts
   export async function getPokemonByType(type: string): Promise<PokemonSummary[]> {
     const data = await request<{ pokemon: { pokemon: PokemonListItem }[] }>(`/type/${type}`)
     return data.pokemon.map((entry) => toSummary(entry.pokemon))
   }
   ```

   Add `PokemonListItem` to the `import type { ... } from '@/types/pokemon'` line.

2. Route, in `router/index.ts`:

   ```ts
   {
     path: '/type/:type',
     name: 'type',
     component: () => import('@/views/TypeView.vue'),
     props: true,
     meta: { title: (to) => `${formatName(String(to.params.type))} type` },
   },
   ```

3. View: `TypeView.vue` receives `defineProps<{ type: string }>()`. It loads data
   with a small composable built like `usePokemon` (watch
   `() => props.type` with `immediate: true`). It renders `<PokemonGrid>` with
   the favorites store, the same way `FavoritesView` does.
4. Link: in `PokemonDetailView.vue`, wrap each badge in
   `<RouterLink :to="{ name: 'type', params: { type } }">`. Keep `TypeBadge`
   itself unaware of routing so it stays reusable.

</details>

---

## Module 5: State management with Pinia

**Checkpoint:** `3d4c097`

### Concepts

- **Why a store**: the favorites list is needed by the header (count), the
  cards (heart icon), the details page and the favorites page. Passing it
  through props would be painful. A store is shared state outside the component
  tree.
- **Setup stores**: `defineStore('id', () => { ... })` uses the same API as
  composables:
  - `ref` is state
  - `computed` is a getter
  - a function is an action
- **One shared instance**: every `useFavoritesStore()` call returns the same
  store. A composable, by contrast, gives each caller a new copy.
- **`storeToRefs()`**: destructure state and getters without losing reactivity.
  You can destructure actions directly.
- **Persistence**: a deep `watch` writes to `localStorage`, and loading is
  defensive (`try/catch`, `Array.isArray`).
- **Store only what you need**: `add()` copies only `id`, `name` and `image`.

### Read

- [`src/stores/favorites.ts`](../src/stores/favorites.ts)
- [`FavoritesView.vue`](../src/views/FavoritesView.vue): `storeToRefs`
- [`AppHeader.vue`](../src/components/AppHeader.vue): a live badge that reads `favorites.count`
- [`HomeView.vue`](../src/views/HomeView.vue): passes `favorites.isFavorite` and
  `favorites.toggle` down to the grid

Open the Pinia tab in Vue DevTools and watch `items` change as you click hearts.

### Exercise

1. Add a `clear()` action and a "Clear all" button on the favorites page. Ask
   for confirmation before clearing.
2. Explain why `const { count } = useFavoritesStore()` would show a number that
   never updates.

<details>
<summary>Solution notes</summary>

1. In the store:

   ```ts
   function clear() {
     items.value = []
   }
   return { items, count, sortedItems, isFavorite, add, remove, toggle, clear }
   ```

   In `FavoritesView.vue`:

   ```ts
   function clearAll() {
     if (window.confirm('Remove all favorites?')) favorites.clear()
   }
   ```

   ```vue
   <button v-if="count" type="button" class="btn" @click="clearAll">Clear all</button>
   ```

   The existing `watch` saves the empty list automatically.

2. The store is a `reactive` object, and reading `store.count` returns a plain
   number. Destructuring copies that number at that moment, so the variable is
   disconnected from the store. `storeToRefs(store)` returns refs that stay
   linked. This is the same reason you can't destructure a `reactive()` object.

</details>

---

## Module 6: Forms and component `v-model`

**Checkpoint:** `91b221f`

### Concepts

- **`v-model` on inputs**: two-way binding between an `<input>` and a ref.
- **`defineModel()`**: makes a component work with `v-model`. The parent writes
  `<SearchBar v-model="searchInput" />` and the child treats `model` like a
  local ref.
  - Under the hood this is a `modelValue` prop plus an `update:modelValue` emit.
- **Event modifiers**: `@submit.prevent` calls `event.preventDefault()`, so the
  form doesn't reload the page.
- **Debounced input**: `useDebounce` waits until typing stops before searching
  and before updating the URL.
- **Accessible forms**:
  - a `<label>`, even when visually hidden
  - `role="search"` on the form
  - `aria-live` on the result count

### Read

- [`SearchBar.vue`](../src/components/SearchBar.vue)
- The "Search" section of [`HomeView.vue`](../src/views/HomeView.vue): `searchInput`
  → `useDebounce` → `usePokemonSearch`, plus `onSubmit` for jumping to an exact match

### Exercise

Add a second model to `SearchBar`: a `<select>` for a Pokémon type, bound with
`defineModel('type')`. In `HomeView`, bind it with `v-model:type="typeFilter"`
and show the selected type in the results summary.

<details>
<summary>Solution notes</summary>

```ts
// SearchBar.vue
const model = defineModel<string>({ required: true })
const type = defineModel<string>('type', { default: '' })
```

```vue
<select v-model="type" aria-label="Filter by type">
  <option value="">All types</option>
  <option v-for="t in ['fire', 'water', 'grass', 'electric']" :key="t" :value="t">{{ t }}</option>
</select>
```

```vue
<!-- HomeView.vue -->
<SearchBar v-model="searchInput" v-model:type="typeFilter" class="search" @submit="onSubmit" />
```

A component can have any number of named models. To filter the results, reuse
`getPokemonByType` from Module 4 and intersect its ids with
`search.results`. That makes a good stretch goal for `computed`.

</details>

---

## Module 7: Testing

**Checkpoint:** `4fa4bcd`

### Concepts

- **Vitest**: the test runner. It uses Vite's config, so `@/` imports work.
  It runs in `jsdom` (see [`vitest.config.ts`](../vitest.config.ts)).
- **`@vue/test-utils`** for components:
  - `mount(Component, { props })`
  - `wrapper.get(selector)`, `.text()` and `.attributes()`
  - `await trigger('click')`
  - `wrapper.emitted('event')` to assert emits
  - `global.stubs` with `RouterLinkStub`, to test without a real router
- **Testing composables without a component**: `withScope()` in
  [`src/test/helpers.ts`](../src/test/helpers.ts) runs the composable inside an
  `effectScope`, so its watchers work. `stop()` cleans up.
- **Mocking the network**:
  - `vi.stubGlobal('fetch', ...)` replaces `fetch` (see `mockFetch`)
  - `vi.unstubAllGlobals()` restores it after each test
  - `clearCache()` resets the API cache between tests
- **Async**: `await flushPromises()` lets pending promises resolve;
  `await nextTick()` lets watchers run.
- **Stores**: call `setActivePinia(createPinia())` in `beforeEach`, so each test
  gets a fresh store.

### Read

- [`src/test/helpers.ts`](../src/test/helpers.ts)
- [`components/__tests__/PokemonCard.spec.ts`](../src/components/__tests__/PokemonCard.spec.ts)
- [`composables/__tests__/usePokemonList.spec.ts`](../src/composables/__tests__/usePokemonList.spec.ts)
- [`stores/__tests__/favorites.spec.ts`](../src/stores/__tests__/favorites.spec.ts)
- [`composables/__tests__/useDebounce.spec.ts`](../src/composables/__tests__/useDebounce.spec.ts): fake timers

Run them with `npm run test:unit` (watch mode) or `npm test` (once).

### Exercise

Write tests for your `useLocalStorage` composable (Module 3) and the `clear()`
action (Module 5).

<details>
<summary>Solution notes</summary>

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { withScope } from '@/test/helpers'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear())

  it('uses the default when nothing is saved', () => {
    const scope = withScope(() => ({ value: useLocalStorage('k', 'hi') }))
    expect(scope.value.value).toBe('hi')
    scope.stop()
  })

  it('reads and saves values', async () => {
    localStorage.setItem('k', JSON.stringify('saved'))
    const scope = withScope(() => ({ value: useLocalStorage('k', '') }))
    expect(scope.value.value).toBe('saved')

    scope.value.value = 'changed'
    await nextTick() // watchers run asynchronously
    expect(localStorage.getItem('k')).toBe('"changed"')
    scope.stop()
  })
})
```

`withScope` merges the result into an object. Wrap a single ref in
`{ value: ... }`, as shown above.

For the store, copy the setup in `favorites.spec.ts`. Add two items, call
`store.clear()`, then check `store.count === 0`, and after `await nextTick()`
check that `localStorage` contains `[]`.

</details>

---

## Module 8: Tooling and shipping

**Checkpoint:** `4fa4bcd`

### Concepts

- **Type checking**: `vue-tsc` checks TypeScript inside `.vue` files, including
  props passed in templates. `npm run build` runs it before bundling.
- **Linting and formatting**:
  - ESLint with `eslint-plugin-vue` catches Vue-specific mistakes, such as a
    missing `:key`
  - oxlint is a fast first pass
  - Prettier keeps the style consistent
- **CI**: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs lint,
  a format check, the tests and the build (which includes the type check) on
  every push and PR.
- **Deploy**: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) builds
  with `BASE_PATH` set to the repository name. That value becomes Vite's
  `base` and `import.meta.env.BASE_URL`, which the router uses for its history
  base. The workflow also copies `index.html` to `404.html`, so deep links such
  as `/pokemon/pikachu` work on a static host.

### Read

- [`package.json`](../package.json) scripts
- [`eslint.config.ts`](../eslint.config.ts), [`.oxlintrc.json`](../.oxlintrc.json)
- Both workflow files

### Exercise

In `PokemonDetailView.vue`, pass `:value="'high'"` to a `StatBar` and run
`npm run type-check`. Then remove a `:key` from a `v-for` and run `npm run check:lint`.
Read both errors and fix them.

<details>
<summary>Solution notes</summary>

`vue-tsc` reports that type `string` is not assignable to type `number` for
the `value` prop. That error would be invisible at runtime until the bar
rendered wrong. ESLint (`vue/require-v-for-key`) reports the missing key.
Both checks run in CI, so this kind of mistake can't reach `main`.

</details>

---

## Beyond this project

The app doesn't use these yet. They are good next topics, and each one can be
practised by extending the Pokédex:

| Concept                               | Idea for practice in this app                                         |
| ------------------------------------- | --------------------------------------------------------------------- |
| `provide` / `inject`                  | Provide a "compact mode" setting from `App.vue` to every card         |
| `<Transition>` / `<TransitionGroup>`  | Animate cards when they are added to or removed from favorites        |
| `<KeepAlive>`                         | Keep `HomeView` alive so going back doesn't re-render the grid        |
| Template refs (`useTemplateRef`)      | Focus the search input when the user presses `/`                      |
| Custom directives                     | A `v-autofocus` directive                                             |
| Navigation guards (`beforeEach`)      | Redirect `/pokemon/0` to the 404 page before the view loads           |
| `<Suspense>` + async `setup`          | Load the details page with top-level `await`                          |
| Nuxt (SSR)                            | Rebuild the app with server-side rendering and pre-rendered pages     |

Official docs to keep open while studying:
[Vue guide](https://vuejs.org/guide/introduction.html),
[Vue Router](https://router.vuejs.org/),
[Pinia](https://pinia.vuejs.org/),
[Vue Test Utils](https://test-utils.vuejs.org/),
[Vitest](https://vitest.dev/).
