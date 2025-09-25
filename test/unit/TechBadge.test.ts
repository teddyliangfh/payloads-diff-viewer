import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../utils/test-utils'
import TechBadge from '~/components/TechBadge.vue'

describe('TechBadge', () => {
  it('should render with correct name', () => {
    const { getByText } = renderWithProviders(TechBadge, {
      props: {
        name: 'Vue.js',
        color: 'green',
      },
    })

    expect(getByText('Vue.js')).toBeInTheDocument()
  })

  it('should apply correct color classes for blue', () => {
    const { container } = renderWithProviders(TechBadge, {
      props: {
        name: 'TypeScript',
        color: 'blue',
      },
    })

    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800')
  })

  it('should apply correct color classes for green', () => {
    const { container } = renderWithProviders(TechBadge, {
      props: {
        name: 'Vue.js',
        color: 'green',
      },
    })

    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('should apply correct color classes for red', () => {
    const { container } = renderWithProviders(TechBadge, {
      props: {
        name: 'React',
        color: 'red',
      },
    })

    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('bg-red-100', 'text-red-800')
  })

  it('should apply default gray color for invalid color', () => {
    const { container } = renderWithProviders(TechBadge, {
      props: {
        name: 'Unknown',
        color: 'invalid' as any,
      },
    })

    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800')
  })

  it('should have correct base classes', () => {
    const { container } = renderWithProviders(TechBadge, {
      props: {
        name: 'Test',
        color: 'blue',
      },
    })

    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass(
      'px-4',
      'py-2',
      'rounded-full',
      'text-sm',
      'font-medium',
      'transition-all',
      'duration-200',
      'hover:scale-105',
    )
  })

  it('should render with all supported colors', () => {
    const colors = [
      'blue',
      'green',
      'yellow',
      'red',
      'purple',
      'pink',
      'indigo',
      'gray',
      'cyan',
    ] as const

    colors.forEach((color) => {
      const { container } = renderWithProviders(TechBadge, {
        props: {
          name: `Test ${color}`,
          color,
        },
      })

      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveClass(`bg-${color}-100`, `text-${color}-800`)
    })
  })
})
