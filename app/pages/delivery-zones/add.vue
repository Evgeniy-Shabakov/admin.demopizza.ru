<script setup>
useHead({
  title: 'Добавить зону доставки'
})

const router = useRouter()
const { createDeliveryZone, loading } = useDeliveryZones()
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

const validationError = ref(null)

onMounted(async () => {
  await Promise.all([
    fetchCities(),
    fetchRestaurants()
  ])
})

const saveDeliveryZone = async () => {
  validationError.value = null
  const result = await createDeliveryZone({
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
    showSuccess('Зона доставки успешно создана')
    validationError.value = null
    router.push('/delivery-zones')
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
            Создать
          </BaseButton>
          <NuxtLink to="/delivery-zones" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
