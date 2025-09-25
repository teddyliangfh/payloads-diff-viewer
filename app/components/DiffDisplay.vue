<template>
  <div class="diff-display">
    <div v-if="!comparisonResult" class="no-data">
      <p class="text-gray-500">No comparison data available</p>
    </div>
    
    <div v-else class="space-y-6">
      <!-- Summary -->
      <div class="bg-white rounded-lg border p-6">
        <h3 class="text-lg font-semibold mb-4">Comparison Summary</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ comparisonResult.totalChanges }}</div>
            <div class="text-sm text-gray-600">Total Changes</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ comparisonResult.summary.images.added + comparisonResult.summary.variants.added + comparisonResult.summary.other.added }}</div>
            <div class="text-sm text-gray-600">Added</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ comparisonResult.summary.images.removed + comparisonResult.summary.variants.removed + comparisonResult.summary.other.removed }}</div>
            <div class="text-sm text-gray-600">Removed</div>
          </div>
        </div>
        
        <!-- Detailed Summary -->
        <div class="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <h4 class="font-medium text-gray-700">Images</h4>
            <div class="text-green-600">+{{ comparisonResult.summary.images.added }}</div>
            <div class="text-red-600">-{{ comparisonResult.summary.images.removed }}</div>
            <div class="text-yellow-600">~{{ comparisonResult.summary.images.modified }}</div>
          </div>
          <div>
            <h4 class="font-medium text-gray-700">Variants</h4>
            <div class="text-green-600">+{{ comparisonResult.summary.variants.added }}</div>
            <div class="text-red-600">-{{ comparisonResult.summary.variants.removed }}</div>
            <div class="text-yellow-600">~{{ comparisonResult.summary.variants.modified }}</div>
          </div>
          <div>
            <h4 class="font-medium text-gray-700">Other</h4>
            <div class="text-green-600">+{{ comparisonResult.summary.other.added }}</div>
            <div class="text-red-600">-{{ comparisonResult.summary.other.removed }}</div>
            <div class="text-yellow-600">~{{ comparisonResult.summary.other.modified }}</div>
          </div>
        </div>
      </div>

      <!-- Changes List -->
      <div class="bg-white rounded-lg border">
        <div class="p-6 border-b">
          <h3 class="text-lg font-semibold">Detailed Changes</h3>
        </div>
        <div class="divide-y">
          <div 
            v-for="(diff, index) in comparisonResult.diffs" 
            :key="index"
            class="p-4 hover:bg-gray-50"
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
                  <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ diff.path }}</code>
                </div>
                <p class="text-sm text-gray-700 mb-2">{{ diff.details }}</p>
                
                <!-- Show old/new values for modified items -->
                <div v-if="diff.type === 'modified' && diff.oldValue !== undefined && diff.newValue !== undefined" class="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div class="font-medium text-red-600 mb-1">Old Value:</div>
                    <div class="bg-red-50 p-2 rounded border-l-2 border-red-200">
                      <pre class="whitespace-pre-wrap">{{ formatValue(diff.oldValue) }}</pre>
                    </div>
                  </div>
                  <div>
                    <div class="font-medium text-green-600 mb-1">New Value:</div>
                    <div class="bg-green-50 p-2 rounded border-l-2 border-green-200">
                      <pre class="whitespace-pre-wrap">{{ formatValue(diff.newValue) }}</pre>
                    </div>
                  </div>
                </div>
                
                <!-- Show value for added/removed items -->
                <div v-else-if="diff.type === 'added' && diff.newValue !== undefined" class="text-xs">
                  <div class="font-medium text-green-600 mb-1">Added Value:</div>
                  <div class="bg-green-50 p-2 rounded border-l-2 border-green-200">
                    <pre class="whitespace-pre-wrap">{{ formatValue(diff.newValue) }}</pre>
                  </div>
                </div>
                
                <div v-else-if="diff.type === 'removed' && diff.oldValue !== undefined" class="text-xs">
                  <div class="font-medium text-red-600 mb-1">Removed Value:</div>
                  <div class="bg-red-50 p-2 rounded border-l-2 border-red-200">
                    <pre class="whitespace-pre-wrap">{{ formatValue(diff.oldValue) }}</pre>
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
      return 'bg-green-100 text-green-800'
    case 'removed':
      return 'bg-red-100 text-red-800'
    case 'modified':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
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
