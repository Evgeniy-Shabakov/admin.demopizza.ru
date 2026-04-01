<script setup>
import { useProducts } from '~/composables/useProducts'
import { useRestaurants } from '~/composables/useRestaurants'

defineProps({
  stopListItem: Object,
  disabled: Boolean,
  showDetails: Boolean,
  validationError: String
})

const form = defineModel({
  default: () => ({
    productId: null,
    restaurantId: null,
    isInStopList: false
  })
})

const { products, fetchProducts } = useProducts()
const { restaurants, fetchRestaurants } = useRestaurants()

onMounted(() => {
  fetchProducts()
  fetchRestaurants()
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="showDetails && stopListItem">
      <BaseLabel for="stop-list-id">ID</BaseLabel>
      <BaseInput
        id="stop-list-id"
        :model-value="stopListItem?.id"
        type="text"
        disabled
      />
    </div>

    <div>
      <BaseLabel for="stop-list-product" required>Товар</BaseLabel>
      <div class="w-full">
        <select
          v-if="disabled && stopListItem"
          id="stop-list-product"
          :value="stopListItem.productId"
          disabled
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        >
          <option v-for="prod in products" :key="prod.id" :value="prod.id">
            {{ prod.name }}
          </option>
        </select>
        <select
          v-else
          id="stop-list-product"
          v-model="form.productId"
          :disabled="disabled"
          required
          :class="[
            'w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            !form.productId && validationError 
              ? 'border-red-500 dark:border-red-400' 
              : 'border-gray-300 dark:border-gray-600'
          ]"
        >
          <option :value="null" disabled>Выберите товар</option>
          <option v-for="prod in products" :key="prod.id" :value="prod.id">
            {{ prod.name }}
          </option>
        </select>
      </div>
    </div>

    <div>
      <BaseLabel for="stop-list-restaurant" required>Ресторан</BaseLabel>
      <div class="w-full">
        <select
          v-if="disabled && stopListItem"
          id="stop-list-restaurant"
          :value="stopListItem.restaurantId"
          disabled
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        >
          <option v-for="rest in restaurants" :key="rest.id" :value="rest.id">
            {{ rest.name }}
          </option>
        </select>
        <select
          v-else
          id="stop-list-restaurant"
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
          <option v-for="rest in restaurants" :key="rest.id" :value="rest.id">
            {{ rest.name }}
          </option>
        </select>
      </div>
    </div>

    <div>
      <BaseLabel for="stop-list-status">В стоп-листе</BaseLabel>
      <BaseCheckbox
        v-if="disabled && stopListItem"
        id="stop-list-status"
        :model-value="stopListItem.isInStopList"
        disabled
      />
      <BaseCheckbox
        v-else
        id="stop-list-status"
        v-model="form.isInStopList"
        :disabled="disabled"
      />
    </div>

    <div v-if="showDetails && stopListItem">
      <BaseLabel for="stop-list-created">Создано</BaseLabel>
      <BaseInput
        id="stop-list-created"
        :model-value="stopListItem.createdAt"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && stopListItem">
      <BaseLabel for="stop-list-updated">Обновлено</BaseLabel>
      <BaseInput
        id="stop-list-updated"
        :model-value="stopListItem.updatedAt"
        type="text"
        disabled
      />
    </div>

    <p v-if="validationError" class="text-sm text-red-500 -mb-6">
      {{ validationError }}
    </p>
  </div>
</template>
