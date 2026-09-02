<script setup>
useHead({
  title: 'Просмотр зоны доставки'
})

const route = useRoute()
const deliveryZoneId = route.params.id
const { getDeliveryZone, loading } = useDeliveryZones()
const { fetchCities, cities } = useCities()
const { fetchRestaurants, restaurants } = useRestaurants()

const deliveryZone = ref(null)

onMounted(async () => {
  await Promise.all([
    getDeliveryZone(Number(deliveryZoneId)),
    fetchCities(),
    fetchRestaurants()
  ])
  deliveryZone.value = await getDeliveryZone(Number(deliveryZoneId))
})
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <BaseCard v-else-if="deliveryZone">
      <FormsDeliveryZoneForm 
        :delivery-zone="deliveryZone" 
        disabled 
        :show-details="true" 
        :cities="cities"
        :restaurants="restaurants"
      />
    </BaseCard>

    <BaseCard v-else>
      <p class="text-gray-500 dark:text-gray-400 text-center">Зона доставки не найдена</p>
    </BaseCard>
  </div>
</template>
