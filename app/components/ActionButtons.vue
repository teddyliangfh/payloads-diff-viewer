<template>
  <div class="bg-white rounded-lg border p-6 mb-6">
    <h2 class="text-xl font-semibold mb-4">Send Payloads</h2>
    <div class="flex gap-4">
      <button 
        @click="$emit('send-payloads')"
        :disabled="loading || payload2Sent || (payload1Sent && !payload2Sent)"
        class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
      >
        {{ buttonText }}
      </button>
    </div>
    
    <div class="mt-4 text-sm text-gray-600">
      <p>• Click "Send Payload" to automatically send both payloads</p>
      <p>• First payload will be sent immediately</p>
      <p>• Second payload will be sent automatically after 30 seconds</p>
      <p>• Comparison results will appear after both payloads are processed</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean
  payload1Sent: boolean
  payload2Sent: boolean
  countdown: number
}

const props = defineProps<Props>()

defineEmits<{
  'send-payloads': []
}>()

const buttonText = computed(() => {
  if (props.loading) {
    if (!props.payload1Sent) {
      return 'Sending First Payload...'
    } else if (!props.payload2Sent) {
      return 'Waiting for Second Payload...'
    } else {
      return 'Processing...'
    }
  }
  
  if (props.payload2Sent) {
    return 'Comparison Complete'
  }
  
  if (props.payload1Sent && !props.payload2Sent) {
    return `Waiting... (${props.countdown}s)`
  }
  
  return 'Send Payload'
})
</script>
