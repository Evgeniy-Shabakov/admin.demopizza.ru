<script setup>
useHead({
  title: 'Редактирование зоны доставки'
})

const route = useRoute()
const deliveryZoneId = route.params.id
const { getDeliveryZone, updateDeliveryZone, loading } = useDeliveryZones()
const { fetchCities, cities } = useCities()
const { fetchRestaurants, restaurants } = useRestaurants()
const { success: showSuccess } = useToast()

const form = ref({
  name: '',
  cityId: null,
  restaurantId: null,
  minOrderValueForDelivery: null,
  deliveryPrice: null,
  orderValueForFreeDelivery: null,
  geojsonFeature: '',
  isActive: true
})

const deliveryZone = ref(null)
const validationError = ref(null)

onMounted(async () => {
  await Promise.all([
    fetchCities(),
    fetchRestaurants()
  ])
  deliveryZone.value = await getDeliveryZone(Number(deliveryZoneId))
  if (deliveryZone.value) {
    form.value.name = deliveryZone.value.name
    form.value.cityId = deliveryZone.value.cityId
    form.value.restaurantId = deliveryZone.value.restaurantId
    form.value.minOrderValueForDelivery = deliveryZone.value.minOrderValueForDelivery
    form.value.deliveryPrice = deliveryZone.value.deliveryPrice
    form.value.orderValueForFreeDelivery = deliveryZone.value.orderValueForFreeDelivery
    form.value.geojsonFeature = deliveryZone.value.geojsonFeature
    form.value.isActive = deliveryZone.value.isActive
  }
})

const saveDeliveryZone = async () => {
  validationError.value = null
  const result = await updateDeliveryZone(Number(deliveryZoneId), {
    name: form.value.name,
    cityId: form.value.cityId,
    restaurantId: form.value.restaurantId,
    minOrderValueForDelivery: form.value.minOrderValueForDelivery,
    deliveryPrice: form.value.deliveryPrice,
    orderValueForFreeDelivery: form.value.orderValueForFreeDelivery,
    geojsonFeature: form.value.geojsonFeature,
    isActive: form.value.isActive
  })
  if (result.success) {
    showSuccess('Зона доставки успешно отредактирована')
    validationError.value = null
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form @submit.prevent="saveDeliveryZone" class="space-y-6">
        <FormsDeliveryZoneForm 
          v-model="form" 
          :cities="cities" 
          :restaurants="restaurants" 
          :validation-error="validationError"
        />

        <div class="flex gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Сохранить
          </BaseButton>
          <NuxtLink :to="`/delivery-zones/${deliveryZoneId}`" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
