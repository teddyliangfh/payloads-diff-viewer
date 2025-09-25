export default defineAppConfig({
  // App-wide configuration
  ui: {
    primary: 'blue',
    gray: 'slate',
    notifications: {
      position: 'top-0 bottom-auto',
    },
  },

  // Feature flags
  features: {
    darkMode: true,
    notifications: true,
    analytics: false,
  },

  // App metadata
  title: 'Nuxt4 Vibe Template',
  description: 'A modern Nuxt 4 template with Cursor vibe coding setup',

  // Theme configuration
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        900: '#1e3a8a',
      },
    },
  },
})
