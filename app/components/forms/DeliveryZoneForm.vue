<script setup>
defineProps({
  deliveryZone: Object,
  disabled: Boolean,
  showDetails: Boolean,
  cities: Array,
  restaurants: Array,
  validationError: String
})

const form = defineModel({
  default: () => ({
    name: '',
    cityId: null,
    restaurantId: null,
    minOrderValueForDelivery: null,
    deliveryPrice: null,
    orderValueForFreeDelivery: null,
    geojsonFeature: '',
    isActive: true
  })
})

const geojsonFeatures = ref([])
const selectedFeatureIndex = ref(null)
const fileInput = ref(null)

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

const handleFeatureSelect = (event) => {
  const selectedOption = featureOptions.value.find(opt => opt.filteredIndex === Number(event.target.value))
  if (!selectedOption) {
    selectedFeatureIndex.value = null
    form.value.geojsonFeature = ''
  } else {
    selectedFeatureIndex.value = selectedOption.originalIndex
    form.value.geojsonFeature = JSON.stringify(selectedOption.feature, null, 2)
  }
}

const clearGeoJson = () => {
  geojsonFeatures.value = []
  selectedFeatureIndex.value = null
  form.value.geojsonFeature = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="showDetails && deliveryZone">
      <BaseLabel for="delivery-zone-id">ID</BaseLabel>
      <BaseInput
        id="delivery-zone-id"
        :model-value="deliveryZone?.id"
        type="text"
        disabled
      />
    </div>

    <div>
      <BaseLabel for="delivery-zone-name" required>Название</BaseLabel>
      <BaseInput
        v-if="disabled && deliveryZone"
        id="delivery-zone-name"
        :model-value="deliveryZone.name"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="delivery-zone-name"
        v-model="form.name"
        type="text"
        :disabled="disabled"
        required
        placeholder="Введите название зоны доставки"
      />
    </div>

    <div>
      <BaseLabel for="delivery-zone-city" required>Город</BaseLabel>
      <div class="w-full">
        <select
          v-if="disabled && deliveryZone"
          id="delivery-zone-city"
          :value="deliveryZone.cityId"
          disabled
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        >
          <option v-for="city in cities" :key="city.id" :value="city.id">
            {{ city.name }}
          </option>
        </select>
        <select
          v-else
          id="delivery-zone-city"
          v-model="form.cityId"
          :disabled="disabled"
          required
          :class="[
            'w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            !form.cityId && validationError 
              ? 'border-red-500 dark:border-red-400' 
              : 'border-gray-300 dark:border-gray-600'
          ]"
        >
          <option :value="null" disabled>Выберите город</option>
          <option v-for="city in cities" :key="city.id" :value="city.id">
            {{ city.name }}
          </option>
        </select>
      </div>
    </div>

    <div>
      <BaseLabel for="delivery-zone-restaurant" required>Ресторан</BaseLabel>
      <div class="w-full">
        <select
          v-if="disabled && deliveryZone"
          id="delivery-zone-restaurant"
          :value="deliveryZone.restaurantId"
          disabled
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        >
          <option v-for="restaurant in restaurants" :key="restaurant.id" :value="restaurant.id">
            {{ restaurant.name }}
          </option>
        </select>
        <select
          v-else
          id="delivery-zone-restaurant"
          v-model="form.restaurantId"
          :disabled="disabled"
          required
          :class="[
            'w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            !form.restaurantId && validationError 
              ? 'border-red-500 dark:border-red-400' 
              : 'border-gray-300 dark:border-gray-600'
          ]"
        >
          <option :value="null" disabled>Выберите ресторан</option>
          <option v-for="restaurant in restaurants" :key="restaurant.id" :value="restaurant.id">
            {{ restaurant.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <BaseLabel for="delivery-zone-min-order">Мин. сумма заказа</BaseLabel>
        <BaseInput
          v-if="disabled && deliveryZone"
          id="delivery-zone-min-order"
          :model-value="deliveryZone.minOrderValueForDelivery"
          type="number"
          disabled
        />
        <BaseInput
          v-else
          id="delivery-zone-min-order"
          v-model="form.minOrderValueForDelivery"
          type="number"
          :disabled="disabled"
          placeholder="0"
        />
      </div>

      <div>
        <BaseLabel for="delivery-zone-price">Стоимость доставки</BaseLabel>
        <BaseInput
          v-if="disabled && deliveryZone"
          id="delivery-zone-price"
          :model-value="deliveryZone.deliveryPrice"
          type="number"
          disabled
        />
        <BaseInput
          v-else
          id="delivery-zone-price"
          v-model="form.deliveryPrice"
          type="number"
          :disabled="disabled"
          placeholder="0"
        />
      </div>

      <div>
        <BaseLabel for="delivery-zone-free-delivery">Бесплатная от</BaseLabel>
        <BaseInput
          v-if="disabled && deliveryZone"
          id="delivery-zone-free-delivery"
          :model-value="deliveryZone.orderValueForFreeDelivery"
          type="number"
          disabled
        />
        <BaseInput
          v-else
          id="delivery-zone-free-delivery"
          v-model="form.orderValueForFreeDelivery"
          type="number"
          :disabled="disabled"
          placeholder="0"
        />
      </div>
    </div>

    <div>
      <BaseLabel>GeoJSON Feature</BaseLabel>
      
      <div v-if="!disabled && !showDetails" class="space-y-3">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg cursor-pointer transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <span>Загрузить GeoJSON</span>
            <input 
              ref="fileInput"
              type="file" 
              accept=".json,.geojson"
              class="hidden"
              @change="handleFileUpload"
            />
          </label>
          
          <button 
            v-if="geojsonFeatures.length > 0"
            type="button"
            @click="clearGeoJson"
            class="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Очистить
          </button>
        </div>

        <div v-if="featureOptions.length > 0">
          <select
            :value="selectedFilteredIndex ?? ''"
            @change="handleFeatureSelect"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Выберите зону доставки</option>
            <option v-for="option in featureOptions" :key="option.filteredIndex" :value="option.filteredIndex">
              {{ option.name }}
            </option>
          </select>
        </div>
      </div>

      <BaseTextarea
        :model-value="disabled && deliveryZone ? deliveryZone.geojsonFeature : form.geojsonFeature"
        disabled
        :rows="4"
        class="mt-3"
      />
    </div>

    <div class="flex items-center gap-3">
      <BaseCheckbox
        :model-value="disabled && deliveryZone ? deliveryZone.isActive : form.isActive"
        :disabled="disabled"
        @update:model-value="form.isActive = $event"
      />
      <span class="text-sm text-gray-700 dark:text-gray-300">Активна</span>
    </div>

    <div v-if="showDetails && deliveryZone">
      <BaseLabel for="delivery-zone-created">Создано</BaseLabel>
      <BaseInput
        id="delivery-zone-created"
        :model-value="deliveryZone.createdAt"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && deliveryZone">
      <BaseLabel for="delivery-zone-updated">Обновлено</BaseLabel>
      <BaseInput
        id="delivery-zone-updated"
        :model-value="deliveryZone.updatedAt"
        type="text"
        disabled
      />
    </div>

    <p v-if="validationError" class="text-sm text-red-500">
      {{ validationError }}
    </p>
  </div>
</template>
