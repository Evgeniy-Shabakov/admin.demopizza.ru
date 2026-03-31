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
      <BaseLabel for="delivery-zone-geojson">GeoJSON Feature</BaseLabel>
      <BaseTextarea
        v-if="disabled && deliveryZone"
        id="delivery-zone-geojson"
        :model-value="deliveryZone.geojsonFeature"
        disabled
        :rows="4"
      />
      <BaseTextarea
        v-else
        id="delivery-zone-geojson"
        v-model="form.geojsonFeature"
        :disabled="disabled"
        placeholder='{"type": "Feature", "geometry": {...}}'
        :rows="4"
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
