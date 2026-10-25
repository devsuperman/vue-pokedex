import type { PokemonSummary } from '@/types/pokemon'

const ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

/** 25 → "#025" */
export function padId(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}

/** "https://pokeapi.co/api/v2/pokemon/25/" → 25 */
export function idFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/)
  if (!match) throw new Error(`Cannot read id from url: ${url}`)
  return Number(match[1])
}

export function artworkUrl(id: number): string {
  return `${ARTWORK_BASE_URL}/${id}.png`
}

/** Converts a list item ({ name, url }) to what a card needs. */
export function toSummary(item: { name: string; url: string }): PokemonSummary {
  const id = idFromUrl(item.url)
  return { id, name: item.name, image: artworkUrl(id) }
}

/** "mr-mime" → "Mr Mime" */
export function formatName(name: string): string {
  return name
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/** PokéAPI height is in decimetres. 7 → "0.7 m" */
export function formatHeight(decimetres: number): string {
  return `${(decimetres / 10).toFixed(1)} m`
}

/** PokéAPI weight is in hectograms. 69 → "6.9 kg" */
export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`
}

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

export function formatStatName(name: string): string {
  return STAT_LABELS[name] ?? formatName(name)
}
