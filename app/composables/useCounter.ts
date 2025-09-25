import { ref, readonly } from 'vue'

/**
 * Counter composable with reactive state management
 * Demonstrates basic state management patterns in Nuxt 4
 */
export const useCounter = (initialValue = 0) => {
  const count = ref(initialValue)

  const increment = () => {
    count.value++
  }

  const decrement = () => {
    count.value--
  }

  const reset = () => {
    count.value = initialValue
  }

  const set = (value: number) => {
    count.value = value
  }

  return {
    count: readonly(count),
    increment,
    decrement,
    reset,
    set,
  }
}
