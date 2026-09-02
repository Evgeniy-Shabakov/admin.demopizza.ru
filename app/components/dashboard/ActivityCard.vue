<script setup>
import BaseCard from '~/components/base/BaseCard.vue'

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <BaseCard>
    <h3 class="text-lg font-semibold mb-4">Последняя активность</h3>
    <div class="space-y-4">
      <div v-for="(item, index) in items" :key="index" class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <span class="text-sm font-medium">{{ item.initials }}</span>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">{{ item.action }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.time }}</p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
