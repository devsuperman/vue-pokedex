/** One entry of GET /pokemon?limit&offset */
export interface PokemonListItem {
  name: string
  url: string
}

/** Response of GET /pokemon?limit&offset */
export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

/** What the UI needs to render a card. Built from list items without extra requests. */
export interface PokemonSummary {
  id: number
  name: string
  image: string
}

/** Subset of GET /pokemon/{id or name} that the app uses */
export interface PokemonDetail {
  id: number
  name: string
  /** decimetres */
  height: number
  /** hectograms */
  weight: number
  types: { slot: number; type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  abilities: { ability: { name: string }; is_hidden: boolean }[]
  sprites: {
    front_default: string | null
    other?: { 'official-artwork'?: { front_default: string | null } }
  }
}
