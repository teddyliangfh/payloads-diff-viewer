<template>
  <div>
    <!-- First payload sent message -->
    <div v-if="payload1Sent && !payload2Sent && !loading" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div class="flex items-center gap-2">
        <div class="text-blue-500">📤</div>
        <span class="text-blue-700">First payload sent successfully! Second payload will be sent automatically in {{ countdown }} seconds...</span>
      </div>
    </div>

    <!-- Second payload sent, waiting for comparison -->
    <div v-if="payload2Sent && !comparisonResult && !loading" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div class="flex items-center gap-2">
        <div class="text-yellow-500">⏳</div>
        <span class="text-yellow-700">Both payloads sent successfully! Comparison results will be displayed soon...</span>
      </div>
    </div>

    <!-- Comparison completed -->
    <div v-if="payload2Sent && comparisonResult && !loading" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div class="flex items-center gap-2">
        <div class="text-green-500">✅</div>
        <span class="text-green-700">Comparison completed successfully! Found {{ comparisonResult.totalChanges }} differences.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComparisonResult } from '~/composables/usePayloads'

interface Props {
  loading: boolean
  payload1Sent: boolean
  payload2Sent: boolean
  comparisonResult: ComparisonResult | null
  countdown: number
}

defineProps<Props>()
</script>
