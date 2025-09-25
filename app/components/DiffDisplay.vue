<template>
  <div class="diff-display">
    <div v-if="!comparisonResult" class="no-data">
      <p class="text-gray-700">No comparison data available</p>
    </div>
    
    <div v-else class="space-y-6">
      <!-- Summary -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 class="text-lg font-semibold mb-4 text-gray-900">Comparison Summary</h3>
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-700">{{ comparisonResult.totalChanges }}</div>
          <div class="text-sm text-gray-700">Total Changes</div>
        </div>
      </div>

      <!-- Changes List -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Detailed Changes</h3>
        </div>
        <div class="divide-y divide-gray-200">
          <div 
            v-for="(diff, index) in comparisonResult.diffs" 
            :key="index"
            class="p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span 
                    :class="getTypeBadgeClass(diff.type)"
                    class="px-2 py-1 rounded text-xs font-medium"
                  >
                    {{ diff.type.toUpperCase() }}
                  </span>
                  <code class="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded font-mono">{{ diff.path }}</code>
                </div>
                
                <!-- Show values -->
                <div class="text-sm mt-2">
                  <div v-if="diff.type === 'modified'" class="grid grid-cols-2 gap-3">
                    <div class="bg-red-50 border border-red-200 p-3 rounded-lg">
                      <div class="text-red-800 font-semibold mb-1">Old:</div>
                      <div class="text-gray-800 font-mono text-xs break-all">{{ formatValue(diff.oldValue) }}</div>
                    </div>
                    <div class="bg-green-50 border border-green-200 p-3 rounded-lg">
                      <div class="text-green-800 font-semibold mb-1">New:</div>
                      <div class="text-gray-800 font-mono text-xs break-all">{{ formatValue(diff.newValue) }}</div>
                    </div>
                  </div>
                  <div v-else-if="diff.type === 'added'" class="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <div class="text-green-800 font-semibold mb-1">Added:</div>
                    <div class="text-gray-800 font-mono text-xs break-all">{{ formatValue(diff.newValue) }}</div>
                  </div>
                  <div v-else-if="diff.type === 'removed'" class="bg-red-50 border border-red-200 p-3 rounded-lg">
                    <div class="text-red-800 font-semibold mb-1">Removed:</div>
                    <div class="text-gray-800 font-mono text-xs break-all">{{ formatValue(diff.oldValue) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComparisonResult, DiffResult } from '~/composables/usePayloads'

interface Props {
  comparisonResult: ComparisonResult | null
}

const props = defineProps<Props>()

const getTypeBadgeClass = (type: DiffResult['type']) => {
  switch (type) {
    case 'added':
      return 'bg-green-100 text-green-800 border border-green-200'
    case 'removed':
      return 'bg-red-100 text-red-800 border border-red-200'
    case 'modified':
      return 'bg-amber-100 text-amber-800 border border-amber-200'
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
}

const formatValue = (value: any): string => {
  if (typeof value === 'string' && value.length > 100) {
    return value.substring(0, 100) + '...'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}
</script>
