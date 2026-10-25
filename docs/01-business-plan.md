# 01 — Business Plan: Pokédex Study Project

## 1. Purpose

This is a **learning project**. The "product" is a small Pokédex web app, but the
real goal is to practice the core concepts of **Vue.js 3** on a realistic,
end-to-end feature set:

- consume a public REST API
- list items with pagination and search
- show a details page
- mark items as favorites and keep them between visits

Each feature is chosen so it maps to one or more Vue concepts (see the
"Learning map" in [02-tech-stack.md](./02-tech-stack.md)).

## 2. Problem & value proposition

| For whom | Need | What the app offers |
|---|---|---|
| Pokémon fans / casual users | Quickly look up a Pokémon and its basic data | Fast, searchable list and clean details page |
| The same users | Remember the Pokémon they like | A personal favorites list saved in the browser |
| **Me (the developer)** | Learn Vue with something more real than a counter | A scoped project covering components, reactivity, routing, state, async data and tests |

## 3. Data source

**PokéAPI** — <https://pokeapi.co/api/v2/> (free, public, no API key, read-only).

Endpoints we will use:

| Endpoint | Used for |
|---|---|
| `GET /pokemon?limit=20&offset=0` | Paginated list (`count`, `next`, `previous`, `results[{ name, url }]`) |
| `GET /pokemon/{id or name}` | Details: id, name, height, weight, types, stats, abilities, sprites |
| `GET /pokemon-species/{id}` *(stretch)* | Description text, genus, evolution chain link |

Images: official artwork via
`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`
(the id can be parsed from the `url` field of each list item, so the list does
not need one extra request per Pokémon).

PokéAPI's fair-use policy asks clients to **cache responses** — we will cache in
memory (and optionally in `localStorage`) to avoid repeated requests.

## 4. Scope

### MVP (must have)

1. **Pokémon list** — grid of cards (image, number, name), paginated (20 per page or "Load more").
2. **Search** — filter by name or number.
3. **Details page** — image, number, name, types, height/weight, base stats, abilities.
4. **Favorites** — toggle a heart on a card or details page; a "Favorites" page lists them; persisted in `localStorage`.
5. **Feedback states** — loading, error (with retry) and empty states.
6. **Responsive layout** — usable on phone and desktop.

### Nice to have (after MVP)

- Filter by type (fire, water, …) using `GET /type/{name}`
- Previous / next Pokémon navigation on the details page
- Description and evolution chain (species endpoint)
- Dark mode
- Infinite scroll instead of buttons
- Deploy (GitHub Pages / Netlify / Vercel)

### Out of scope

- User accounts / backend / server-side favorites
- Editing data (the API is read-only)
- Battle features, team builder, i18n

## 5. User stories

| # | As a user I want to… | So that… | Acceptance criteria |
|---|---|---|---|
| US1 | see a list of Pokémon | I can browse them | Cards show image, `#001`-style number and name; 20 per page; loading indicator while fetching |
| US2 | page through the list | I can reach any Pokémon | Next/Previous (or Load more) works; current page is kept in the URL (`?page=3`) |
| US3 | search by name or number | I find one quickly | Typing filters results; exact name/number goes straight to the details page; "not found" message |
| US4 | open a Pokémon's details | I learn about it | Route `/pokemon/:name`; shows types, height (m), weight (kg), stats bars, abilities; back button returns to the same list page |
| US5 | mark/unmark a favorite | I keep the ones I like | Heart toggles on card and details; state is identical everywhere instantly |
| US6 | see my favorites | I find them again | Route `/favorites`; empty state when none; survives page reload |
| US7 | be told when something fails | I'm not stuck | Error message with a "Try again" button; invalid route shows a 404 page |

## 6. Success criteria

Because this is a study project, success is measured in **learning outcomes**
more than users:

- [ ] All MVP user stories done and working
- [ ] I can explain each item in the Learning map (props vs. emits, `ref` vs. `reactive`, `computed` vs. `watch`, router params, Pinia store, composables)
- [ ] Core logic covered by unit tests (store + composables + a few components)
- [ ] App deployed with a public URL
- [ ] README explains how to run it and what I learned

Quality targets: list page loads in < 2 s on a normal connection, no console
errors, Lighthouse accessibility score ≥ 90.

## 7. Risks & mitigations

| Risk | Mitigation |
|---|---|
| API slow or down | Loading/error states, in-memory cache, retry button |
| Too many requests (one per card) | Build image URL from id instead of fetching details for each card |
| Search needs the full list (API has no "search" endpoint) | Fetch the lightweight name list once (`?limit=100000`, ~1300 entries), cache it, filter client-side |
| Scope creep | Stick to MVP first; nice-to-haves only after milestone 4 |
| Learning too many tools at once | Introduce one concept per milestone (see tasks doc) |

## 8. Milestones (summary)

| Milestone | Outcome |
|---|---|
| M0 | Project set up, tooling working |
| M1 | Static components + layout |
| M2 | List from the API with pagination |
| M3 | Routing + details page |
| M4 | Favorites with Pinia + persistence |
| M5 | Search, polish, error handling |
| M6 | Tests + deploy |
| M7 | Nice-to-haves |

Detailed tasks: [03-tasks.md](./03-tasks.md).
