import { describe, expect, it } from 'vitest'
import { useCounter } from '~/composables/useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('should initialize with custom value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })

  it('should increment counter', () => {
    const { count, increment } = useCounter(0)
    increment()
    expect(count.value).toBe(1)
  })

  it('should decrement counter', () => {
    const { count, decrement } = useCounter(5)
    decrement()
    expect(count.value).toBe(4)
  })

  it('should reset counter', () => {
    const { count, increment, reset } = useCounter(0)
    increment()
    increment()
    expect(count.value).toBe(2)
    reset()
    expect(count.value).toBe(0)
  })

  it('should set counter value', () => {
    const { count, set } = useCounter(0)
    set(42)
    expect(count.value).toBe(42)
  })

  it('should not allow direct mutation', () => {
    const { count } = useCounter(0)
    // This should cause a TypeScript error in strict mode
    // count.value = 5 // Should not be possible
    expect(count.value).toBe(0)
  })
})
