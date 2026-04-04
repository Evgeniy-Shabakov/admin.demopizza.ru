<script setup>
const { connectionStatus } = useConnectionStatus()

const isConnected = computed(() => connectionStatus.value?.isConnected ?? true)
const isRequesting = computed(() => connectionStatus.value?.isRequesting ?? false)

const statusClass = computed(() => {
  if (!isConnected.value) {
    return 'bg-red-500'
  }
  if (isRequesting.value) {
    return 'bg-green-300 ring-2 ring-green-400/50'
  }
  return 'bg-green-500'
})

const dotClass = computed(() => {
  if (isRequesting.value) {
    return 'animate-ping'
  }
  return ''
})
</script>

<template>
  <div class="fixed top-2 right-2 flex cursor-help"
       title="Состояние соединения с базой данных">
    <div :class="['w-2.5 h-2.5 rounded-full transition-all', statusClass]"></div>
    <div v-if="isRequesting"
         :class="['absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400', dotClass]"></div>
  </div>
</template>