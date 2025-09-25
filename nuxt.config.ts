// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Development tools
  devtools: { enabled: true },

  // Modern app directory structure
  srcDir: 'app/',

  // CSS framework
  css: ['~/assets/css/main.css'],

  // Modules
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt'],

  // Development server configuration
  devServer: {
    port: 3000,
    host: 'localhost'
  },

  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: process.env.API_SECRET || 'default-secret',

    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.API_BASE || '/api',
      appName: process.env.APP_NAME || 'Payload Diff Viewer',
      appVersion: process.env.APP_VERSION || '1.0.0',
    },
  },

  // App configuration
  app: {
    head: {
      title: 'Payload Diff Viewer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Compare JSON payloads and visualize differences' },
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
