<script setup>
import BaseCard from '~/components/base/BaseCard.vue'

defineProps({
  stats: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <BaseCard>
    <h3 class="text-lg font-semibold mb-4">Быстрая статистика</h3>
    <div class="space-y-4">
      <div v-for="(stat, index) in stats" :key="index">
        <div class="flex justify-between text-sm mb-1">
          <span>{{ stat.label }}</span>
          <span>{{ stat.value }}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div :class="['h-2 rounded-full', stat.colorClass]" :style="{ width: stat.value + '%' }"></div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
