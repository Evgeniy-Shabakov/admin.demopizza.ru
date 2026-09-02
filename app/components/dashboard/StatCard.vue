<script setup>
import BaseCard from '~/components/base/BaseCard.vue'

defineProps({
  title: String,
  value: String,
  change: String,
  changeType: {
    type: String,
    default: 'positive'
  },
  iconName: {
    type: String,
    default: 'users'
  }
})

const icons = {
  users: {
    bgClass: 'w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center',
    textClass: 'w-6 h-6 text-indigo-600 dark:text-indigo-400',
    path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  },
  revenue: {
    bgClass: 'w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center',
    textClass: 'w-6 h-6 text-green-600 dark:text-green-400',
    path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  orders: {
    bgClass: 'w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center',
    textClass: 'w-6 h-6 text-orange-600 dark:text-orange-400',
    path: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
  },
  products: {
    bgClass: 'w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center',
    textClass: 'w-6 h-6 text-purple-600 dark:text-purple-400',
    path: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  }
}
</script>

<template>
  <BaseCard>
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ title }}</p>
        <p class="text-2xl font-bold mt-1">{{ value }}</p>
      </div>
      <div :class="icons[iconName].bgClass">
        <svg :class="icons[iconName].textClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icons[iconName].path" />
        </svg>
      </div>
    </div>
    <p :class="['text-sm mt-4', changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400']">
      {{ change }}
    </p>
  </BaseCard>
</template>
