import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { withScope } from '@/test/helpers'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('updates only after the value stops changing', async () => {
    const source = ref('a')
    const { debounced, stop } = withScope(() => ({ debounced: useDebounce(source, 300) }))

    source.value = 'ab'
    await nextTick()
    vi.advanceTimersByTime(200)
    source.value = 'abc'
    await nextTick()
    vi.advanceTimersByTime(200)
    expect(debounced.value).toBe('a')

    vi.advanceTimersByTime(100)
    expect(debounced.value).toBe('abc')
    stop()
  })
})
