<template>
  <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
    <div class="flex items-center gap-2">
      <div class="text-red-600">⚠️</div>
      <span class="text-red-800">{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error: string | null
}

defineProps<Props>()
</script>
