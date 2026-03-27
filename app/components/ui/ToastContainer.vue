<script setup>
const { toasts, removeToast } = useToast()

const expandedToasts = ref([])

const toggleDetails = (id) => {
  const idx = expandedToasts.value.indexOf(id)
  if (idx > -1) {
    expandedToasts.value.splice(idx, 1)
  } else {
    expandedToasts.value.push(id)
  }
}

const isExpanded = (id) => expandedToasts.value.includes(id)
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg min-w-80 max-w-md border',
            toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-100' :
            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-100' :
            'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100'
          ]"
        >
          <svg v-if="toast.type === 'success'" class="w-5 h-5 shrink-0 mt-0.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="toast.type === 'error'" class="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else class="w-5 h-5 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
               <p v-if="toast.statusCode" class="px-1.5 py-0.5 text-xs font-mono bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300 rounded">
                  {{ toast.statusCode }}
               </p>
               <p class="font-medium">{{ toast.message }}</p>
            </div>
            <button 
              v-if="toast.details" 
              @click="toggleDetails(toast.id)"
              class="text-sm mt-1 opacity-70 hover:opacity-100 underline"
            >
              {{ isExpanded(toast.id) ? 'Скрыть детали' : 'Показать детали' }}
            </button>
            <pre v-if="toast.details && isExpanded(toast.id)" class="text-xs mt-2 opacity-70 whitespace-pre-wrap break-all font-mono leading-tight max-h-[70vh] overflow-y-auto custom-scrollbar">{{ toast.details }}</pre>
          </div>
          <button @click="removeToast(toast.id)" class="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
