import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StatBar from '../StatBar.vue'

describe('StatBar', () => {
  it('sets the bar width from the value', () => {
    const wrapper = mount(StatBar, { props: { label: 'HP', value: 51, max: 255 } })
    expect(wrapper.text()).toContain('HP')
    expect(wrapper.get('.stat-bar__fill').attributes('style')).toContain('width: 20%')
  })

  it('never goes over 100%', () => {
    const wrapper = mount(StatBar, { props: { label: 'HP', value: 300, max: 255 } })
    expect(wrapper.get('.stat-bar__fill').attributes('style')).toContain('width: 100%')
  })
})
