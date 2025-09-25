<template>
  <div class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About This Template
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Built with modern web development best practices
        </p>
      </div>

      <div class="prose prose-lg dark:prose-invert max-w-none">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Why This Template?
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            This template combines the latest technologies and best practices to give you a
            head start on your next project. It's specifically designed for developers who
            want to build modern, scalable applications with minimal setup time.
          </p>

          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Key Benefits:
          </h3>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            <li>Zero-config setup with sensible defaults</li>
            <li>TypeScript support out of the box</li>
            <li>Modern CSS with Tailwind CSS</li>
            <li>Comprehensive testing setup with Vitest</li>
            <li>Optimized for Cursor AI coding</li>
            <li>Dark mode support</li>
            <li>Responsive design patterns</li>
          </ul>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 mr-2 text-blue-600" />
              Development Experience
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Hot module replacement, TypeScript IntelliSense, ESLint integration,
              and Prettier formatting ensure a smooth development workflow.
            </p>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Icon name="heroicons:shield-check" class="w-5 h-5 mr-2 text-green-600" />
              Production Ready
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Optimized builds, error handling, SEO meta tags, and performance
              monitoring ready for production deployment.
            </p>
          </div>
        </div>

        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 class="text-2xl font-bold mb-4">🎯 Perfect For</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <Icon name="heroicons:building-office" class="w-8 h-8 mx-auto mb-2" />
              <p class="font-medium">SaaS Applications</p>
            </div>
            <div class="text-center">
              <Icon name="heroicons:globe-alt" class="w-8 h-8 mx-auto mb-2" />
              <p class="font-medium">Marketing Sites</p>
            </div>
            <div class="text-center">
              <Icon name="heroicons:briefcase" class="w-8 h-8 mx-auto mb-2" />
              <p class="font-medium">Portfolio Sites</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'About - Nuxt4 Vibe Template',
  meta: [{ name: 'description', content: 'Learn about the Nuxt4 Vibe Template and its features' }],
})

useSeoMeta({
  title: 'About - Nuxt4 Vibe Template',
  ogTitle: 'About - Nuxt4 Vibe Template',
  description: 'Learn about the Nuxt4 Vibe Template and its features',
  ogDescription: 'Learn about the Nuxt4 Vibe Template and its features',
})
</script>
