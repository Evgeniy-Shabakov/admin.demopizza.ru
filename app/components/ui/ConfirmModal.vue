<script setup>
defineProps({
  show: Boolean,
  title: String,
  message: String,
  confirmText: {
    type: String,
    default: 'Подтвердить'
  },
  cancelText: {
    type: String,
    default: 'Отмена'
  },
  type: {
    type: String,
    default: 'danger'
  },
  loading: Boolean
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0" @click="emit('cancel')"></div>
      <div class="relative bg-gray-100 dark:bg-gray-700 rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100">
        <button 
          @click="emit('cancel')"
          class="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div :class="[
          'w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center',
          type === 'danger' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30'
        ]">
          <svg v-if="type === 'danger'" class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg v-else class="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h3 v-if="title" class="text-lg font-semibold text-center mb-3 text-gray-900 dark:text-white">{{ title }}</h3>
        
        <p class="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed mb-6">
          Вы уверены? Это действие нельзя отменить.
        </p>

        <div class="flex gap-3">
          <button 
            @click="emit('cancel')" 
            class="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-medium rounded-xl transition-colors cursor-pointer"
          >
            {{ cancelText }}
          </button>
          <button 
            @click="emit('confirm')" 
            :disabled="loading" 
            :class="[
              'flex-1 px-4 py-2.5 font-medium rounded-xl transition-colors cursor-pointer disabled:opacity-50',
              type === 'danger' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            ]"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ confirmText }}
            </span>
            <span v-else>{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
