<script setup>
useHead({
  title: 'Просмотр ресторана'
})

const route = useRoute()
const restaurantId = route.params.id
const { getRestaurant, loading } = useRestaurants()
const { fetchCities, cities } = useCities()
const { fetchRestaurantSchedules, restaurantSchedules } = useRestaurantSchedules()

const restaurant = ref(null)

onMounted(async () => {
  await Promise.all([
    getRestaurant(Number(restaurantId)),
    fetchCities(),
    fetchRestaurantSchedules()
  ])
  restaurant.value = await getRestaurant(Number(restaurantId))
})

const getCityName = (cityId) => {
  const city = cities.value.find(c => c.id === cityId)
  return city?.name || '—'
}

const getScheduleName = (scheduleId) => {
  const schedule = restaurantSchedules.value.find(s => s.id === scheduleId)
  return schedule?.name || '—'
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <BaseCard v-else-if="restaurant">
      <FormsRestaurantForm 
        :restaurant="restaurant" 
        disabled 
        :show-details="true" 
        :cities="cities"
        :schedules="restaurantSchedules"
      />
    </BaseCard>

    <BaseCard v-else>
      <p class="text-gray-500 dark:text-gray-400 text-center">Ресторан не найден</p>
    </BaseCard>
  </div>
</template>
