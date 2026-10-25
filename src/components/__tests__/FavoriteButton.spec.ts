import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FavoriteButton from '../FavoriteButton.vue'

describe('FavoriteButton', () => {
  it('has an accessible label that depends on the state', async () => {
    const wrapper = mount(FavoriteButton, { props: { active: false, name: 'Pikachu' } })
    expect(wrapper.attributes('aria-label')).toBe('Add Pikachu to favorites')

    await wrapper.setProps({ active: true })
    expect(wrapper.attributes('aria-label')).toBe('Remove Pikachu from favorites')
    expect(wrapper.classes()).toContain('favorite-button--active')
  })

  it('emits toggle on click', async () => {
    const wrapper = mount(FavoriteButton, { props: { active: false, name: 'Pikachu' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })
})
