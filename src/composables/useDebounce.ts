import { onScopeDispose, ref, watch, type Ref } from 'vue'

/** Returns a ref that follows `source`, but only after it stopped changing for `delay` ms. */
export function useDebounce<T>(source: Ref<T>, delay = 300): Ref<T> {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(source, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = value
    }, delay)
  })

  // Clean up if the component using this is unmounted before the timer fires
  onScopeDispose(() => clearTimeout(timer))

  return debounced
}
