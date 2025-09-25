<template>
  <div class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Demo Components
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          Interactive examples showcasing the template's capabilities
        </p>
      </div>

      <!-- Counter Demo -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🔢 Counter with State Management
        </h2>
        <div class="flex items-center justify-center space-x-4">
          <button @click="decrement"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            -
          </button>

          <div class="text-3xl font-bold text-gray-900 dark:text-white min-w-[4rem] text-center">
            {{ counter.count }}
          </div>

          <button @click="increment"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            +
          </button>
        </div>

        <div class="mt-4 text-center">
          <button @click="reset"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Reset
          </button>
        </div>
      </div>

      <!-- Form Demo -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📝 Form with Validation
        </h2>

        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input id="name" v-model="form.name" type="text" required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your name" />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input id="email" v-model="form.email" type="email" required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your email" />
          </div>

          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea id="message" v-model="form.message" rows="4"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your message" />
          </div>

          <button type="submit" :disabled="isSubmitting"
            class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <span v-if="isSubmitting">Submitting...</span>
            <span v-else>Submit</span>
          </button>
        </form>

        <div v-if="submittedData" class="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 class="font-medium text-green-800 dark:text-green-200 mb-2">Form Submitted!</h3>
          <pre class="text-sm text-green-700 dark:text-green-300">{{ JSON.stringify(submittedData, null, 2) }}</pre>
        </div>
      </div>

      <!-- API Demo -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🌐 API Integration Demo
        </h2>

        <div class="space-y-4">
          <button @click="fetchData" :disabled="isLoading"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
            <span v-if="isLoading">Loading...</span>
            <span v-else>Fetch Random User</span>
          </button>

          <div v-if="userData" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">User Data:</h3>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Name:</strong> {{ userData.name.first }} {{ userData.name.last }}</p>
              <p><strong>Email:</strong> {{ userData.email }}</p>
              <p><strong>Phone:</strong> {{ userData.phone }}</p>
            </div>
          </div>

          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p class="text-red-700 dark:text-red-300">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Local Storage Demo -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          💾 Local Storage Demo
        </h2>

        <div class="space-y-4">
          <input v-model="storageKey" type="text" placeholder="Storage key"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />

          <input v-model="storageValue" type="text" placeholder="Storage value"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />

          <div class="flex space-x-2">
            <button @click="saveToStorage"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save
            </button>
            <button @click="loadFromStorage"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Load
            </button>
            <button @click="clearStorage"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Clear
            </button>
          </div>

          <div v-if="storageResult" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              <strong>Result:</strong> {{ storageResult }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page metadata
useHead({
  title: 'Demo - Nuxt4 Vibe Template',
  meta: [{ name: 'description', content: 'Interactive demo showcasing the template features' }],
})

// Reactive state
const counter = useCounter()
const form = reactive({
  name: '',
  email: '',
  message: '',
})

const submittedData = ref(null)
const isSubmitting = ref(false)

// API demo state
const userData = ref(null)
const isLoading = ref(false)
const error = ref(null)

// Local storage demo state
const storageKey = ref('demo-key')
const storageValue = ref('demo-value')
const storageResult = ref('')

// Methods
const increment = () => counter.increment()
const decrement = () => counter.decrement()
const reset = () => counter.reset()

const submitForm = async () => {
  isSubmitting.value = true

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  submittedData.value = { ...form }
  isSubmitting.value = false
}

const fetchData = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await $fetch('https://randomuser.me/api/')
    userData.value = response.results[0]
  } catch (err) {
    error.value = 'Failed to fetch user data'
  } finally {
    isLoading.value = false
  }
}

const saveToStorage = () => {
  if (storageKey.value && storageValue.value) {
    localStorage.setItem(storageKey.value, storageValue.value)
    storageResult.value = `Saved "${storageValue.value}" with key "${storageKey.value}"`
  }
}

const loadFromStorage = () => {
  if (storageKey.value) {
    const value = localStorage.getItem(storageKey.value)
    storageResult.value = value ? `Loaded: "${value}"` : 'No value found'
  }
}

const clearStorage = () => {
  if (storageKey.value) {
    localStorage.removeItem(storageKey.value)
    storageResult.value = `Cleared key "${storageKey.value}"`
  }
}
</script>
