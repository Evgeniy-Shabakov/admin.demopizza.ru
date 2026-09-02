<script setup>
useHead({
  title: 'Просмотр графика работы'
})

const route = useRoute()
const scheduleId = route.params.id
const { getRestaurantSchedule, loading } = useRestaurantSchedules()

const schedule = ref(null)

onMounted(async () => {
  schedule.value = await getRestaurantSchedule(Number(scheduleId))
})
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <BaseCard v-else-if="schedule">
      <FormsRestaurantScheduleForm 
        :schedule="schedule" 
        disabled 
        :show-details="true" 
      />
    </BaseCard>

    <BaseCard v-else>
      <p class="text-gray-500 dark:text-gray-400 text-center">График работы не найден</p>
    </BaseCard>
  </div>
</template>
