<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Payload Diff Viewer</h1>
        <p class="text-gray-600">Compare JSON payloads and visualize differences</p>
      </div>

      <!-- Status Bar -->
      <StatusBar
        :loading="loading"
        :payload1-sent="payload1Sent"
        :payload2-sent="payload2Sent"
        :comparison-result="comparisonResult"
        @clear-all="clearAllData"
      />

      <!-- Error Display -->
      <ErrorDisplay :error="error" />

      <!-- Action Buttons -->
      <ActionButtons
        :loading="loading"
        :payload1-sent="payload1Sent"
        :payload2-sent="payload2Sent"
        :countdown="countdown"
        @send-payloads="sendPayloads"
      />

      <!-- Loading Indicator -->
      <LoadingIndicator
        :loading="loading"
        :payload1-sent="payload1Sent"
        :payload2-sent="payload2Sent"
      />

      <!-- Status Messages -->
      <StatusMessages
        :loading="loading"
        :payload1-sent="payload1Sent"
        :payload2-sent="payload2Sent"
        :comparison-result="comparisonResult"
        :countdown="countdown"
      />

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
    console.error('Sample payloads not loaded')
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
</script>
