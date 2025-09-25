<template>
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
        @click="$emit('clear-all')"
        :disabled="loading"
        class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
      >
        Clear All
      </button>
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
}

defineProps<Props>()

defineEmits<{
  'clear-all': []
}>()
</script>
