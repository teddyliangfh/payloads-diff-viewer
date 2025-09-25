<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Payload Diff Viewer</h1>
        <p class="text-gray-600">Compare JSON payloads and visualize differences</p>
      </div>

      <!-- Status Bar -->
      <div class="bg-white rounded-lg border p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div :class="payload1Sent ? 'bg-green-500' : 'bg-gray-300'" class="w-3 h-3 rounded-full"></div>
              <span class="text-sm font-medium">Payload 1</span>
            </div>
            <div class="flex items-center gap-2">
              <div :class="payload2Sent ? 'bg-green-500' : 'bg-gray-300'" class="w-3 h-3 rounded-full"></div>
              <span class="text-sm font-medium">Payload 2</span>
            </div>
            <div class="flex items-center gap-2">
              <div :class="comparisonResult ? 'bg-blue-500' : 'bg-gray-300'" class="w-3 h-3 rounded-full"></div>
              <span class="text-sm font-medium">Comparison</span>
            </div>
          </div>
          <button 
            @click="clearAllData"
            :disabled="loading"
            class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
          >
            Clear All
          </button>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center gap-2">
          <div class="text-red-500">⚠️</div>
          <span class="text-red-700">{{ error }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="bg-white rounded-lg border p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Send Payloads</h2>
        <div class="flex gap-4">
          <button 
            @click="sendPayloads"
            :disabled="loading || payload2Sent || (payload1Sent && !payload2Sent)"
            class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
          >
            {{ getButtonText() }}
          </button>
        </div>
        
        <div class="mt-4 text-sm text-gray-600">
          <p>• Click "Send Payload" to automatically send both payloads</p>
          <p>• First payload will be sent immediately</p>
          <p>• Second payload will be sent automatically after 30 seconds</p>
          <p>• Comparison results will appear after both payloads are processed</p>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="bg-white rounded-lg border p-6 mb-6">
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">{{ getLoadingMessage() }}</span>
        </div>
      </div>

      <!-- Success Messages -->
      <div v-if="payload1Sent && !payload2Sent && !loading" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex items-center gap-2">
          <div class="text-blue-500">📤</div>
          <span class="text-blue-700">First payload sent successfully! Second payload will be sent automatically in {{ countdown }} seconds...</span>
        </div>
      </div>

      <div v-if="payload2Sent && !comparisonResult && !loading" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div class="flex items-center gap-2">
          <div class="text-yellow-500">⏳</div>
          <span class="text-yellow-700">Both payloads sent successfully! Comparison results will be displayed soon...</span>
        </div>
      </div>

      <div v-if="payload2Sent && comparisonResult && !loading" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div class="flex items-center gap-2">
          <div class="text-green-500">✅</div>
          <span class="text-green-700">Comparison completed successfully! Found {{ comparisonResult.totalChanges }} differences.</span>
        </div>
      </div>

      <!-- Diff Display -->
      <DiffDisplay :comparison-result="comparisonResult" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PayloadData } from '~/composables/usePayloads'

// Use the payloads composable
const { 
  loading, 
  error, 
  payload1Sent, 
  payload2Sent, 
  comparisonResult,
  sendPayload1,
  sendPayload2,
  clearData,
  loadSamplePayloads
} = usePayloads()

// Sample payloads
let samplePayloads: { payload1: PayloadData; payload2: PayloadData } | null = null

// Countdown timer for second payload
const countdown = ref(30)
let countdownInterval: NodeJS.Timeout | null = null

// Load sample payloads on component mount
onMounted(async () => {
  try {
    samplePayloads = await loadSamplePayloads()
  } catch (err) {
    console.error('Failed to load sample payloads:', err)
  }
})

// Clean up interval on unmount
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

// Send both payloads with automatic 30-second delay
const sendPayloads = async () => {
  if (!samplePayloads) {
    error.value = 'Sample payloads not loaded'
    return
  }
  
  try {
    // Send first payload
    await sendPayload1(samplePayloads.payload1)
    
    // Start countdown for second payload
    countdown.value = 30
    countdownInterval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownInterval!)
        countdownInterval = null
        // Send second payload automatically
        sendPayload2(samplePayloads!.payload2).catch(err => {
          console.error('Failed to send payload 2:', err)
        })
      }
    }, 1000)
    
  } catch (err) {
    console.error('Failed to send payloads:', err)
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
  }
}

// Get button text based on current state
const getButtonText = () => {
  if (loading.value) {
    if (!payload1Sent.value) {
      return 'Sending First Payload...'
    } else if (!payload2Sent.value) {
      return 'Waiting for Second Payload...'
    } else {
      return 'Processing...'
    }
  }
  
  if (payload2Sent.value) {
    return 'Comparison Complete'
  }
  
  if (payload1Sent.value && !payload2Sent.value) {
    return `Waiting... (${countdown.value}s)`
  }
  
  return 'Send Payload'
}

// Get loading message based on current state
const getLoadingMessage = () => {
  if (!payload1Sent.value) {
    return 'Sending first payload...'
  } else if (!payload2Sent.value) {
    return 'Waiting for second payload to be sent automatically...'
  } else {
    return 'Processing comparison results...'
  }
}

// Clear all data
const clearAllData = async () => {
  try {
    // Clear countdown interval
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
    countdown.value = 30
    
    await clearData()
  } catch (err) {
    console.error('Failed to clear data:', err)
  }
}

// Page metadata
useHead({
  title: 'Payload Diff Viewer',
  meta: [
    { name: 'description', content: 'Compare JSON payloads and visualize differences' },
  ],
})
</script>