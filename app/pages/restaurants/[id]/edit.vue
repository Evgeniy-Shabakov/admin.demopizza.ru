<script setup>
useHead({
  title: 'Редактирование ресторана'
})

const route = useRoute()
const restaurantId = route.params.id
const { getRestaurant, updateRestaurant, loading } = useRestaurants()
const { fetchCities, cities } = useCities()
const { fetchRestaurantSchedules, restaurantSchedules } = useRestaurantSchedules()
const { success: showSuccess } = useToast()

const form = ref({
  name: '',
  cityId: null,
  restaurantScheduleId: null,
  deliveryToAddressAvailable: false,
  pickUpAtCounterAvailable: false,
  pickUpAtCarWindowAvailable: false,
  atRestaurantAtCounterAvailable: false,
  atRestaurantToTableAvailable: false,
  deliveryToRestaurantParkingAvailable: false,
  isActive: true,
  street: '',
  house: '',
  addressAsString: ''
})

const restaurant = ref(null)
const validationError = ref(null)

onMounted(async () => {
  await Promise.all([
    fetchCities(),
    fetchRestaurantSchedules()
  ])
  restaurant.value = await getRestaurant(Number(restaurantId))
  if (restaurant.value) {
    form.value.name = restaurant.value.name
    form.value.cityId = restaurant.value.cityId
    form.value.restaurantScheduleId = restaurant.value.restaurantScheduleId
    form.value.deliveryToAddressAvailable = restaurant.value.deliveryToAddressAvailable
    form.value.pickUpAtCounterAvailable = restaurant.value.pickUpAtCounterAvailable
    form.value.pickUpAtCarWindowAvailable = restaurant.value.pickUpAtCarWindowAvailable
    form.value.atRestaurantAtCounterAvailable = restaurant.value.atRestaurantAtCounterAvailable
    form.value.atRestaurantToTableAvailable = restaurant.value.atRestaurantToTableAvailable
    form.value.deliveryToRestaurantParkingAvailable = restaurant.value.deliveryToRestaurantParkingAvailable
    form.value.isActive = restaurant.value.isActive
    form.value.street = restaurant.value.street
    form.value.house = restaurant.value.house
    form.value.addressAsString = restaurant.value.addressAsString
  }
})

const saveRestaurant = async () => {
  validationError.value = null
  const result = await updateRestaurant(Number(restaurantId), {
    name: form.value.name,
    cityId: form.value.cityId,
    restaurantScheduleId: form.value.restaurantScheduleId,
    deliveryToAddressAvailable: form.value.deliveryToAddressAvailable,
    pickUpAtCounterAvailable: form.value.pickUpAtCounterAvailable,
    pickUpAtCarWindowAvailable: form.value.pickUpAtCarWindowAvailable,
    atRestaurantAtCounterAvailable: form.value.atRestaurantAtCounterAvailable,
    atRestaurantToTableAvailable: form.value.atRestaurantToTableAvailable,
    deliveryToRestaurantParkingAvailable: form.value.deliveryToRestaurantParkingAvailable,
    isActive: form.value.isActive,
    street: form.value.street,
    house: form.value.house,
    addressAsString: form.value.addressAsString
  })
  if (result.success) {
    showSuccess('Ресторан успешно отредактирован')
    validationError.value = null
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form @submit.prevent="saveRestaurant" class="space-y-6">
        <FormsRestaurantForm 
          v-model="form" 
          :cities="cities" 
          :schedules="restaurantSchedules" 
          :validation-error="validationError"
        />

        <div class="flex gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Сохранить
          </BaseButton>
          <NuxtLink :to="`/restaurants/${restaurantId}`" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
