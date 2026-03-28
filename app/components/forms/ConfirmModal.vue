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
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="emit('cancel')">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50 transition-opacity" @click="emit('cancel')"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
          <div :class="[
            'flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full',
            type === 'danger' ? 'bg-red-100 dark:bg-red-900/50' : 'bg-indigo-100 dark:bg-indigo-900/50'
          ]">
            <svg v-if="type === 'danger'" class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg v-else class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 v-if="title" class="text-lg font-semibold text-center mb-2">{{ title }}</h3>
          <p v-if="message" class="text-gray-500 dark:text-gray-400 text-center mb-6">
            <slot>{{ message }}</slot>
          </p>
          <div class="flex gap-3">
            <button @click="emit('cancel')" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
              {{ cancelText }}
            </button>
            <button @click="emit('confirm')" :disabled="loading" :class="[
              'flex-1 px-4 py-2 rounded-lg transition-colors cursor-pointer',
              type === 'danger' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            ]">
              {{ loading ? 'Загрузка...' : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
