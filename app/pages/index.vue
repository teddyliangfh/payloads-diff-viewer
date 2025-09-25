<template>
  <div class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Hero section -->
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to
          <span class="text-blue-600 dark:text-blue-400">Nuxt 4</span>
          <br />
          Vibe Template
        </h1>

        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          A modern, production-ready template featuring Nuxt 4, TypeScript, Tailwind CSS,
          Vitest testing, and Cursor vibe coding setup.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/demo"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            View Demo
            <Icon name="heroicons:arrow-right" class="ml-2 w-4 h-4" />
          </NuxtLink>

          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Icon name="heroicons:code-bracket" class="mr-2 w-4 h-4" />
            View Source
          </a>
        </div>
      </div>

      <!-- Features grid -->
      <div class="mt-20">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          What's Included
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard title="Nuxt 4"
            description="Latest Nuxt framework with enhanced performance and developer experience"
            icon="heroicons:bolt" />

          <FeatureCard title="TypeScript"
            description="Full TypeScript support with strict type checking and enhanced IntelliSense"
            icon="heroicons:code-bracket" />

          <FeatureCard title="Tailwind CSS"
            description="Utility-first CSS framework with dark mode support and responsive design"
            icon="heroicons:paint-brush" />

          <FeatureCard title="Vitest Testing"
            description="Fast unit testing with Vitest, including coverage reports and UI" icon="heroicons:beaker" />

          <FeatureCard title="Cursor Vibe"
            description="Optimized for Cursor AI coding with proper rules and configurations"
            icon="heroicons:sparkles" />

        </div>
      </div>

      <!-- Tech stack -->
      <div class="mt-20">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Tech Stack
        </h2>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <TechBadge name="Nuxt 4" color="green" />
            <TechBadge name="Vue 3" color="green" />
            <TechBadge name="TypeScript" color="blue" />
            <TechBadge name="Tailwind" color="cyan" />
            <TechBadge name="Vitest" color="yellow" />
            <TechBadge name="Pinia" color="yellow" />
            <TechBadge name="VueUse" color="purple" />
          </div>
        </div>
      </div>

      <!-- Getting started -->
      <div class="mt-20">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 class="text-3xl font-bold mb-4">Ready to Start Building?</h2>
          <p class="text-blue-100 mb-6">
            This template is ready to use. Start coding your next project with modern tools and best practices.
          </p>

          <div class="bg-black/20 rounded-lg p-4 font-mono text-sm">
            <div class="text-green-400"># Install dependencies</div>
            <div class="text-white">npm install</div>
            <div class="text-green-400 mt-2"># Start development server</div>
            <div class="text-white">npm run dev</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page metadata
useHead({
  title: 'Home - Nuxt4 Vibe Template',
  meta: [
    { name: 'description', content: 'A modern Nuxt 4 template with Cursor vibe coding setup' },
  ],
})

// SEO
useSeoMeta({
  title: 'Nuxt4 Vibe Template - Modern Development Setup',
  ogTitle: 'Nuxt4 Vibe Template - Modern Development Setup',
  description:
    'A modern, production-ready template featuring Nuxt 4, TypeScript, Tailwind CSS, Vitest testing, and Cursor vibe coding setup.',
  ogDescription:
    'A modern, production-ready template featuring Nuxt 4, TypeScript, Tailwind CSS, Vitest testing, and Cursor vibe coding setup.',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
})
</script>
