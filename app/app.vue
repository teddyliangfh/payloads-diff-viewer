<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- Development overlay -->
    <DevOnly>
      <div class="fixed bottom-4 right-4 z-50">
        <div class="bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-mono">
          Payload Diff Viewer
        </div>
      </div>
    </DevOnly>
  </div>
</template>

<script setup>
// Global app setup
useHead({
  htmlAttrs: {
    lang: 'en',
  },
})

// Global error handling
onErrorCaptured((error, instance, info) => {
  console.error('Global error captured:', error, info)
  return false
})
</script>

<style>
/* Global styles */
html {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  scroll-behavior: smooth;
}

body {
  @apply bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200;
}

/* Focus styles */
*:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900;
}
</style>
