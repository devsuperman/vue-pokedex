import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorMessage from '../ErrorMessage.vue'

describe('ErrorMessage', () => {
  it('shows the message and emits retry', async () => {
    const wrapper = mount(ErrorMessage, { props: { message: 'Oops' } })
    expect(wrapper.get('[role="alert"]').text()).toContain('Oops')

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })
})
