<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <div class="p-2 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">Payload Diff Viewer</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            Built with
            <span class="text-blue-600 dark:text-blue-400 font-medium">Nuxt 4</span>
            and
            <span class="text-green-600 dark:text-green-400 font-medium">Cursor Vibe</span>
          </p>
          <p class="text-gray-400 dark:text-gray-500 text-xs mt-2">
            Template ready for development with TypeScript and Vitest
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const colorMode = useColorMode()
const mobileMenuOpen = ref(false)

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Close mobile menu on route change
const route = useRoute()
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  },
)
</script>
