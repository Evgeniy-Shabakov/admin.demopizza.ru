<script setup>
useHead({
  title: 'Редактирование графика работы'
})

const route = useRoute()
const scheduleId = route.params.id
const { getRestaurantSchedule, updateRestaurantSchedule, loading } = useRestaurantSchedules()
const { success: showSuccess } = useToast()

const formatTime = (time) => {
  if (!time) return ''
  if (typeof time === 'string') return time
  const hours = String(time.hours || 0).padStart(2, '0')
  const minutes = String(time.minutes || 0).padStart(2, '0')
  return `${hours}:${minutes}`
}

const form = ref({
  name: '',
  mondayOpenTime: '',
  mondayCloseTime: '',
  mondayIsOpen: true,
  tuesdayOpenTime: '',
  tuesdayCloseTime: '',
  tuesdayIsOpen: true,
  wednesdayOpenTime: '',
  wednesdayCloseTime: '',
  wednesdayIsOpen: true,
  thursdayOpenTime: '',
  thursdayCloseTime: '',
  thursdayIsOpen: true,
  fridayOpenTime: '',
  fridayCloseTime: '',
  fridayIsOpen: true,
  saturdayOpenTime: '',
  saturdayCloseTime: '',
  saturdayIsOpen: true,
  sundayOpenTime: '',
  sundayCloseTime: '',
  sundayIsOpen: true
})

const schedule = ref(null)
const validationError = ref(null)

onMounted(async () => {
  schedule.value = await getRestaurantSchedule(Number(scheduleId))
  if (schedule.value) {
    form.value.name = schedule.value.name
    form.value.mondayOpenTime = formatTime(schedule.value.mondayOpenTime)
    form.value.mondayCloseTime = formatTime(schedule.value.mondayCloseTime)
    form.value.mondayIsOpen = schedule.value.mondayIsOpen
    form.value.tuesdayOpenTime = formatTime(schedule.value.tuesdayOpenTime)
    form.value.tuesdayCloseTime = formatTime(schedule.value.tuesdayCloseTime)
    form.value.tuesdayIsOpen = schedule.value.tuesdayIsOpen
    form.value.wednesdayOpenTime = formatTime(schedule.value.wednesdayOpenTime)
    form.value.wednesdayCloseTime = formatTime(schedule.value.wednesdayCloseTime)
    form.value.wednesdayIsOpen = schedule.value.wednesdayIsOpen
    form.value.thursdayOpenTime = formatTime(schedule.value.thursdayOpenTime)
    form.value.thursdayCloseTime = formatTime(schedule.value.thursdayCloseTime)
    form.value.thursdayIsOpen = schedule.value.thursdayIsOpen
    form.value.fridayOpenTime = formatTime(schedule.value.fridayOpenTime)
    form.value.fridayCloseTime = formatTime(schedule.value.fridayCloseTime)
    form.value.fridayIsOpen = schedule.value.fridayIsOpen
    form.value.saturdayOpenTime = formatTime(schedule.value.saturdayOpenTime)
    form.value.saturdayCloseTime = formatTime(schedule.value.saturdayCloseTime)
    form.value.saturdayIsOpen = schedule.value.saturdayIsOpen
    form.value.sundayOpenTime = formatTime(schedule.value.sundayOpenTime)
    form.value.sundayCloseTime = formatTime(schedule.value.sundayCloseTime)
    form.value.sundayIsOpen = schedule.value.sundayIsOpen
  }
})

const saveSchedule = async () => {
  validationError.value = null
  const result = await updateRestaurantSchedule(Number(scheduleId), {
    name: form.value.name,
    mondayOpenTime: form.value.mondayOpenTime || null,
    mondayCloseTime: form.value.mondayCloseTime || null,
    mondayIsOpen: form.value.mondayIsOpen,
    tuesdayOpenTime: form.value.tuesdayOpenTime || null,
    tuesdayCloseTime: form.value.tuesdayCloseTime || null,
    tuesdayIsOpen: form.value.tuesdayIsOpen,
    wednesdayOpenTime: form.value.wednesdayOpenTime || null,
    wednesdayCloseTime: form.value.wednesdayCloseTime || null,
    wednesdayIsOpen: form.value.wednesdayIsOpen,
    thursdayOpenTime: form.value.thursdayOpenTime || null,
    thursdayCloseTime: form.value.thursdayCloseTime || null,
    thursdayIsOpen: form.value.thursdayIsOpen,
    fridayOpenTime: form.value.fridayOpenTime || null,
    fridayCloseTime: form.value.fridayCloseTime || null,
    fridayIsOpen: form.value.fridayIsOpen,
    saturdayOpenTime: form.value.saturdayOpenTime || null,
    saturdayCloseTime: form.value.saturdayCloseTime || null,
    saturdayIsOpen: form.value.saturdayIsOpen,
    sundayOpenTime: form.value.sundayOpenTime || null,
    sundayCloseTime: form.value.sundayCloseTime || null,
    sundayIsOpen: form.value.sundayIsOpen
  })
  if (result.success) {
    showSuccess('График работы успешно отредактирован')
    validationError.value = null
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form @submit.prevent="saveSchedule" class="space-y-6">
        <FormsRestaurantScheduleForm 
          v-model="form" 
          :validation-error="validationError"
        />

        <div class="flex gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Сохранить
          </BaseButton>
          <NuxtLink :to="`/restaurant-schedules/${scheduleId}`" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
