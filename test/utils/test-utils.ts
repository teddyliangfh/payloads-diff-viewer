import { type RenderOptions, render } from '@testing-library/vue'
import { createPinia } from 'pinia'
import { vi } from 'vitest'
import { type Component, createApp } from 'vue'

// Custom render function that includes common providers
export function renderWithProviders(component: Component, options: RenderOptions<unknown> = {}) {
  const pinia = createPinia()

  const defaultOptions: RenderOptions<unknown> = {
    global: {
      plugins: [pinia],
      stubs: {
        // Stub common Nuxt components
        NuxtLink: {
          template: '<a><slot /></a>',
          props: ['to'],
        },
        NuxtImg: {
          template: '<img><slot /></img>',
          props: ['src', 'alt'],
        },
        NuxtPage: {
          template: '<div><slot /></div>',
        },
        ClientOnly: {
          template: '<div><slot /></div>',
        },
      },
    },
    ...options,
  }

  return render(component, defaultOptions)
}

// Helper to create a test app with common providers
export function createTestApp(component: Component, _options: RenderOptions<unknown> = {}) {
  const app = createApp(component)
  const pinia = createPinia()

  app.use(pinia)

  return app
}

// Mock Nuxt composables
export const mockNuxtComposables = () => {
  return {
    useRoute: () => ({
      path: '/',
      params: {},
      query: {},
      hash: '',
      fullPath: '/',
      matched: [],
      meta: {},
      redirectedFrom: undefined,
      name: undefined,
    }),
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      beforeEach: vi.fn(),
      afterEach: vi.fn(),
    }),
    useHead: vi.fn(),
    useSeoMeta: vi.fn(),
    useNuxtApp: () => ({
      $router: {
        push: vi.fn(),
        replace: vi.fn(),
      },
      $route: {
        path: '/',
        params: {},
        query: {},
      },
    }),
    navigateTo: vi.fn(),
    useRuntimeConfig: () => ({
      public: {},
    }),
  }
}

// Re-export everything from @testing-library/vue
export * from '@testing-library/vue'
