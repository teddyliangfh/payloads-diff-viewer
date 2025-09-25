// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Development tools
  devtools: { enabled: true },

  // Modern app directory structure
  srcDir: 'app/',

  // CSS framework
  css: ['~/assets/css/main.css'],

  // Modules
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt', '@nuxtjs/color-mode'],

  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: process.env.API_SECRET || 'default-secret',

    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.API_BASE || '/api',
      appName: process.env.APP_NAME || 'Nuxt4 Vibe Template',
      appVersion: process.env.APP_VERSION || '1.0.0',
    },
  },

  // App configuration
  app: {
    head: {
      title: 'Nuxt4 Vibe Template',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern Nuxt 4 template with Cursor vibe coding setup' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false, // Temporarily disabled to fix startup issues
  },

  // Nitro configuration for server-side
  nitro: {
    experimental: {
      wasm: true,
    },
  },

  // Build configuration
  build: {
    transpile: [],
  },

  // Color mode configuration
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    storageKey: 'nuxt-color-mode',
  },

  // Tailwind CSS configuration
  tailwindcss: {
    config: {
      content: [
        './app/**/*.{js,vue,ts}',
        './app/components/**/*.{js,vue,ts}',
        './app/layouts/**/*.vue',
        './app/pages/**/*.vue',
        './app/plugins/**/*.{js,ts}',
        './app/utils/**/*.{js,ts}',
        './app/app.vue',
      ],
    },
  },
})
