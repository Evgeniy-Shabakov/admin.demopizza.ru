<script setup>
useHead({
  title: 'Добавить ресторан'
})

const { createRestaurant, loading } = useRestaurants()
const { fetchCities, cities } = useCities()
const { fetchRestaurantSchedules, restaurantSchedules } = useRestaurantSchedules()
const { success: showSuccess } = useToast()

const form = ref({
  name: '',
  cityId: null,
  restaurantScheduleId: null,
  deliveryToAddressAvailable: true,
  pickUpAtCounterAvailable: true,
  pickUpAtCarWindowAvailable: false,
  atRestaurantAtCounterAvailable: false,
  atRestaurantToTableAvailable: false,
  deliveryToRestaurantParkingAvailable: false,
  isActive: true,
  street: '',
  house: '',
  addressAsString: ''
})

const formRef = ref(null)
const validationError = ref(null)

onMounted(() => {
  fetchCities()
  fetchRestaurantSchedules()
})

const handleSaveAndAdd = async () => {
  if (formRef.value?.reportValidity()) {
    await saveRestaurant(false)
  }
}

const saveRestaurant = async (navigateToList = false) => {
  validationError.value = null
  const result = await createRestaurant({
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
    showSuccess('Ресторан успешно добавлен')
    validationError.value = null
    if (navigateToList) {
      navigateTo('/restaurants')
    } else {
      form.value = {
        name: '',
        cityId: null,
        restaurantScheduleId: null,
        deliveryToAddressAvailable: true,
        pickUpAtCounterAvailable: true,
        pickUpAtCarWindowAvailable: false,
        atRestaurantAtCounterAvailable: false,
        atRestaurantToTableAvailable: false,
        deliveryToRestaurantParkingAvailable: false,
        isActive: true,
        street: '',
        house: '',
        addressAsString: ''
      }
    }
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="saveRestaurant(true)" class="space-y-6">
        <FormsRestaurantForm 
          v-model="form" 
          :cities="cities" 
          :schedules="restaurantSchedules" 
          :validation-error="validationError" 
        />

        <div class="flex flex-wrap gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Добавить
          </BaseButton>
          <BaseButton type="button" :loading="loading" @click="handleSaveAndAdd">
            Добавить и добавить еще
          </BaseButton>
          <NuxtLink to="/restaurants" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
