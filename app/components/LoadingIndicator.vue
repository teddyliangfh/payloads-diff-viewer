<template>
  <div v-if="loading" class="bg-white rounded-lg border p-6 mb-6">
    <div class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">{{ loadingMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean
  payload1Sent: boolean
  payload2Sent: boolean
}

const props = defineProps<Props>()

const loadingMessage = computed(() => {
  if (!props.payload1Sent) {
    return 'Sending first payload...'
  } else if (!props.payload2Sent) {
    return 'Waiting for second payload to be sent automatically...'
  } else {
    return 'Processing comparison results...'
  }
})
</script>
