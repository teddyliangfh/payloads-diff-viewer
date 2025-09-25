import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const value = ref<T>(defaultValue)

  // Read from localStorage on initialization
  try {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      value.value = JSON.parse(stored)
    }
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error)
  }

  // Watch for changes and save to localStorage
  watch(
    value,
    (newValue) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.warn(`Error writing localStorage key "${key}":`, error)
      }
    },
    { deep: true },
  )

  const setValue = (newValue: T) => {
    value.value = newValue
  }

  const remove = () => {
    try {
      localStorage.removeItem(key)
      value.value = defaultValue
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }

  return {
    value,
    setValue,
    remove,
  }
}
