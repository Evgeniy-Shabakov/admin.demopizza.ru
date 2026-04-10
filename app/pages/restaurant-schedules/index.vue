<script setup>
useHead({
  title: 'Графики работы'
})

const router = useRouter()
const { restaurantSchedules, loading, fetchRestaurantSchedules, deleteRestaurantSchedule } = useRestaurantSchedules()
const { success: showSuccess } = useToast()

onMounted(() => {
  fetchRestaurantSchedules()
})

const handleRowClick = (id) => {
  router.push(`/restaurant-schedules/${id}`)
}

const handleDelete = async (item) => {
  const result = await deleteRestaurantSchedule(item.id)
  if (result) {
    showSuccess('График работы успешно удалён')
  }
}

const formatTime = (time) => {
  if (!time) return '—'
  if (typeof time === 'string') return time
  const hours = String(time.hours || 0).padStart(2, '0')
  const minutes = String(time.minutes || 0).padStart(2, '0')
  return `${hours}:${minutes}`
}

const days = [
  { key: 'monday', label: 'Пн' },
  { key: 'tuesday', label: 'Вт' },
  { key: 'wednesday', label: 'Ср' },
  { key: 'thursday', label: 'Чт' },
  { key: 'friday', label: 'Пт' },
  { key: 'saturday', label: 'Сб' },
  { key: 'sunday', label: 'Вс' }
]

const getDaySchedule = (schedule, dayKey) => {
  const isOpen = schedule[`${dayKey}IsOpen`]
  if (!isOpen) return 'Выходной'
  const openTime = formatTime(schedule[`${dayKey}OpenTime`])
  const closeTime = formatTime(schedule[`${dayKey}CloseTime`])
  return `${openTime} - ${closeTime}`
}

const getDayScheduleMobile = (schedule, dayKey) => {
  const isOpen = schedule[`${dayKey}IsOpen`]
  if (!isOpen) return 'Выходной'
  const openTime = formatTime(schedule[`${dayKey}OpenTime`])
  const closeTime = formatTime(schedule[`${dayKey}CloseTime`])
  return `${openTime} - ${closeTime}`
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Название', white: true, mobileLabel: 'Название' },
  ...days.map(day => ({
    key: day.key,
    label: day.label,
    align: 'center',
    render: (item) => {
      const value = getDaySchedule(item, day.key)
      const isOpen = item[`${day.key}IsOpen`]
      return `<span class="${isOpen ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}">${value}</span>`
    },
    mobileRender: (item) => `${day.label}: ${getDayScheduleMobile(item, day.key)}`,
    mobileLabel: day.label
  })),
  { key: 'createdAt', label: 'Создано', showInMobile: false },
  { key: 'updatedAt', label: 'Обновлено', showInMobile: false },
  { key: 'actions', label: 'Действия', sticky: true, showInMobile: false }
]
</script>

<template>
  <UiListTable
    :items="restaurantSchedules"
    :columns="columns"
    :loading="loading"
    empty-text="Графики работы не найдены"
    view-link-prefix="/restaurant-schedules"
    edit-link-prefix="/restaurant-schedules"
    delete-label="график работы"
    @row-click="handleRowClick"
    @delete="handleDelete"
  />
</template>
