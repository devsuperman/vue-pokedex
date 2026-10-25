import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { STORAGE_KEY, useFavoritesStore } from '../favorites'

const pikachu = { id: 25, name: 'pikachu', image: 'pikachu.png' }
const bulbasaur = { id: 1, name: 'bulbasaur', image: 'bulbasaur.png' }

describe('favorites store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('starts empty', () => {
    const store = useFavoritesStore()
    expect(store.items).toEqual([])
    expect(store.count).toBe(0)
  })

  it('toggles a favorite on and off', () => {
    const store = useFavoritesStore()
    store.toggle(pikachu)
    expect(store.isFavorite(25)).toBe(true)
    expect(store.count).toBe(1)

    store.toggle(pikachu)
    expect(store.isFavorite(25)).toBe(false)
    expect(store.count).toBe(0)
  })

  it('does not add duplicates', () => {
    const store = useFavoritesStore()
    store.add(pikachu)
    store.add(pikachu)
    expect(store.count).toBe(1)
  })

  it('keeps only the summary fields', () => {
    const store = useFavoritesStore()
    store.add({ ...pikachu, extra: 'ignored' } as typeof pikachu)
    expect(store.items[0]).toEqual(pikachu)
  })

  it('sorts favorites by number', () => {
    const store = useFavoritesStore()
    store.add(pikachu)
    store.add(bulbasaur)
    expect(store.sortedItems.map((p) => p.id)).toEqual([1, 25])
  })

  it('saves to localStorage and loads it back', async () => {
    const store = useFavoritesStore()
    store.add(pikachu)
    await nextTick() // the watcher that saves runs after the change

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([pikachu])

    setActivePinia(createPinia()) // simulates a page reload
    expect(useFavoritesStore().items).toEqual([pikachu])
  })

  it('ignores corrupted localStorage data', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(useFavoritesStore().items).toEqual([])
  })
})
