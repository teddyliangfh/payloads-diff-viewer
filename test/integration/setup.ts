import { beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.NUXT_PUBLIC_API_BASE = '/api'

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRuntimeConfig: vi.fn(() => ({
    public: {
      apiBase: '/api',
      appName: 'Test App',
      appVersion: '1.0.0',
    },
  })),
  useHead: vi.fn(),
  useSeoMeta: vi.fn(),
  navigateTo: vi.fn(),
  useRoute: vi.fn(() => ({
    path: '/',
    query: {},
    params: {},
    hash: '',
    fullPath: '/',
    matched: [],
    meta: {},
    redirectedFrom: undefined,
    name: undefined,
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
    beforeEach: vi.fn(),
    afterEach: vi.fn(),
  })),
  useNuxtApp: vi.fn(() => ({
    $router: {
      push: vi.fn(),
      replace: vi.fn(),
    },
    $route: {
      path: '/',
      params: {},
      query: {},
    },
  })),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
})
