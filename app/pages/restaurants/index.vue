<script setup>
useHead({
  title: 'Рестораны'
})

const router = useRouter()
const { restaurants, loading, fetchRestaurants, deleteRestaurant } = useRestaurants()
const { fetchCities, cities } = useCities()
const { fetchRestaurantSchedules, restaurantSchedules } = useRestaurantSchedules()
const { success: showSuccess } = useToast()

onMounted(() => {
  fetchRestaurants()
  fetchCities()
  fetchRestaurantSchedules()
})

const handleRowClick = (id) => {
  router.push(`/restaurants/${id}`)
}

const handleDelete = async (item) => {
  const result = await deleteRestaurant(item.id)
  if (result) {
    showSuccess('Ресторан успешно удалён')
  }
}

const getCityName = (cityId) => {
  const city = cities.value.find(c => c.id === cityId)
  return city?.name || '—'
}

const getScheduleName = (scheduleId) => {
  const schedule = restaurantSchedules.value.find(s => s.id === scheduleId)
  return schedule?.name || '—'
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Название', bold: true },
  { key: 'city', label: 'Город', render: (item) => getCityName(item.cityId), mobileLabel: 'Город' },
  { key: 'schedule', label: 'График работы', render: (item) => getScheduleName(item.restaurantScheduleId), showInMobile: false },
  { key: 'address', label: 'Адрес', render: (item) => item.addressAsString || '—', showInMobile: false },
  { 
    key: 'isActive', 
    label: 'Активен',
    align: 'center',
    render: (item) => item.isActive 
      ? '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30"><svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></span>'
      : '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></span>',
    showInMobile: false
  },
  { key: 'createdAt', label: 'Создано', showInMobile: false },
  { key: 'updatedAt', label: 'Обновлено', showInMobile: false },
  { key: 'actions', label: 'Действия', sticky: true, showInMobile: false }
]
</script>

<template>
  <UiListTable
    :items="restaurants"
    :columns="columns"
    :loading="loading"
    empty-text="Рестораны не найдены"
    view-link-prefix="/restaurants"
    edit-link-prefix="/restaurants"
    delete-label="ресторан"
    @row-click="handleRowClick"
    @delete="handleDelete"
  />
</template>
