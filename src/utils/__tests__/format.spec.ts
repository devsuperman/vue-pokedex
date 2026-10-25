import { describe, expect, it } from 'vitest'
import {
  artworkUrl,
  formatHeight,
  formatName,
  formatStatName,
  formatWeight,
  idFromUrl,
  padId,
  toSummary,
} from '../format'

describe('format utils', () => {
  it('pads ids to three digits', () => {
    expect(padId(1)).toBe('#001')
    expect(padId(25)).toBe('#025')
    expect(padId(1025)).toBe('#1025')
  })

  it('reads the id from a PokéAPI url', () => {
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/10001')).toBe(10001)
    expect(() => idFromUrl('https://pokeapi.co/api/v2/pokemon/')).toThrow('Cannot read id')
  })

  it('builds a summary from a list item', () => {
    expect(toSummary({ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' })).toEqual({
      id: 25,
      name: 'pikachu',
      image: artworkUrl(25),
    })
  })

  it('formats names', () => {
    expect(formatName('pikachu')).toBe('Pikachu')
    expect(formatName('mr-mime')).toBe('Mr Mime')
  })

  it('converts units', () => {
    expect(formatHeight(4)).toBe('0.4 m')
    expect(formatWeight(60)).toBe('6.0 kg')
  })

  it('formats stat names', () => {
    expect(formatStatName('hp')).toBe('HP')
    expect(formatStatName('special-attack')).toBe('Sp. Atk')
    expect(formatStatName('accuracy')).toBe('Accuracy')
  })
})
