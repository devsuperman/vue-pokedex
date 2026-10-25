import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import PokemonCard from '../PokemonCard.vue'

const pikachu = { id: 25, name: 'pikachu', image: 'pikachu.png' }

function mountCard(favorite = false) {
  return mount(PokemonCard, {
    props: { pokemon: pikachu, favorite },
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
}

describe('PokemonCard', () => {
  it('shows number, name and image', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('#025')
    expect(wrapper.text()).toContain('Pikachu')
    expect(wrapper.get('img').attributes('src')).toBe('pikachu.png')
    expect(wrapper.get('img').attributes('alt')).toBe('Pikachu')
  })

  it('links to the details page', () => {
    const wrapper = mountCard()
    expect(wrapper.getComponent(RouterLinkStub).props('to')).toEqual({
      name: 'pokemon',
      params: { name: 'pikachu' },
    })
  })

  it('emits toggle-favorite with the pokemon', async () => {
    const wrapper = mountCard()
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('toggle-favorite')).toEqual([[pikachu]])
  })

  it('reflects the favorite state', () => {
    expect(mountCard(true).get('button').attributes('aria-pressed')).toBe('true')
    expect(mountCard(false).get('button').attributes('aria-pressed')).toBe('false')
  })
})
