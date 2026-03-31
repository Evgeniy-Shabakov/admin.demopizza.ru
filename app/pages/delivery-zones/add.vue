<script setup>
useHead({
  title: 'Добавить зону доставки'
})

const { createDeliveryZone, loading } = useDeliveryZones()
const { fetchCities, cities } = useCities()
const { fetchRestaurants, restaurants } = useRestaurants()
const { success: showSuccess } = useToast()

const geojsonFeatures = ref([])
const selectedFeatureIndex = ref(null)

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

const formRef = ref(null)
const validationError = ref(null)

onMounted(async () => {
  await Promise.all([
    fetchCities(),
    fetchRestaurants()
  ])
})

const featureOptions = computed(() => {
  return geojsonFeatures.value
    .filter(feature => feature.geometry?.type === 'Polygon')
    .map((feature, filteredIndex) => {
      const originalIndex = geojsonFeatures.value.indexOf(feature)
      const properties = feature.properties || {}
      const name = properties.description || `Зона ${filteredIndex + 1}`
      return {
        originalIndex,
        filteredIndex,
        name,
        feature
      }
    })
})

const selectedFilteredIndex = computed(() => {
  if (selectedFeatureIndex.value === null) return null
  const option = featureOptions.value.find(opt => opt.originalIndex === selectedFeatureIndex.value)
  return option?.filteredIndex ?? null
})

const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const geojson = JSON.parse(e.target.result)
      if (geojson.type === 'FeatureCollection' && Array.isArray(geojson.features)) {
        geojsonFeatures.value = geojson.features
        selectedFeatureIndex.value = null
        form.value.geojsonFeature = ''
      } else if (geojson.type === 'Feature') {
        geojsonFeatures.value = [geojson]
        selectedFeatureIndex.value = 0
        form.value.geojsonFeature = JSON.stringify(geojson, null, 2)
      } else {
        geojsonFeatures.value = []
        form.value.geojsonFeature = ''
      }
    } catch (error) {
      console.error('Ошибка парсинга GeoJSON:', error)
      geojsonFeatures.value = []
    }
  }
  reader.readAsText(file)
}

const updateSelectedFeature = (index) => {
  selectedFeatureIndex.value = index
}

const clearGeoJson = () => {
  geojsonFeatures.value = []
  selectedFeatureIndex.value = null
  form.value.geojsonFeature = ''
}

const handleSaveAndAdd = async () => {
  if (formRef.value?.reportValidity()) {
    const validation = validateForm()
    if (!validation.valid) {
      validationError.value = validation.message
      return
    }
    await saveDeliveryZone(false)
  }
}

const validateForm = () => {
  if (!form.value.cityId) {
    return { valid: false, message: 'Выберите город' }
  }
  if (!form.value.restaurantId) {
    return { valid: false, message: 'Выберите ресторан' }
  }
  if (form.value.minOrderValueForDelivery === null || form.value.minOrderValueForDelivery === undefined || form.value.minOrderValueForDelivery === '') {
    return { valid: false, message: 'Введите минимальную сумму заказа' }
  }
  if (form.value.deliveryPrice === null || form.value.deliveryPrice === undefined || form.value.deliveryPrice === '') {
    return { valid: false, message: 'Введите стоимость доставки' }
  }
  if (!form.value.geojsonFeature) {
    return { valid: false, message: 'Выберите зону доставки' }
  }
  return { valid: true }
}

const saveDeliveryZone = async (navigateToList = true) => {
  const validation = validateForm()
  if (!validation.valid) {
    validationError.value = validation.message
    return
  }
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
    if (navigateToList) {
      navigateTo('/delivery-zones')
    } else {
      form.value = {
        name: '',
        cityId: null,
        restaurantId: null,
        minOrderValueForDelivery: null,
        deliveryPrice: null,
        orderValueForFreeDelivery: null,
        geojsonFeature: '',
        isActive: true
      }
      geojsonFeatures.value = []
      selectedFeatureIndex.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
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
      <form ref="formRef" @submit.prevent="saveDeliveryZone(true)" class="space-y-6">
        <FormsDeliveryZoneForm 
          v-model="form" 
          :cities="cities" 
          :restaurants="restaurants" 
          :validation-error="validationError"
          :geojson-features="geojsonFeatures"
          :selected-feature-index="selectedFeatureIndex"
          :feature-options="featureOptions"
          :selected-filtered-index="selectedFilteredIndex"
          @handle-file-upload="handleFileUpload"
          @update:selected-feature-index="updateSelectedFeature"
          @clear-geo-json="clearGeoJson"
        />

        <div class="flex flex-wrap gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Добавить
          </BaseButton>
          <BaseButton type="button" :loading="loading" @click="handleSaveAndAdd">
            Добавить и добавить еще
          </BaseButton>
          <NuxtLink to="/delivery-zones" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
