<script setup>
import { useProducts } from '~/composables/useProducts'

const props = defineProps({
  modelValue: Number,
  disabled: Boolean,
  error: Boolean
})

defineEmits(['update:modelValue'])

const { products, fetchProducts } = useProducts()

onMounted(() => {
  fetchProducts()
})

const getProductImageUrl = (product) => {
  if (!product.imagePath) return null
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl.replace('/api/v1', '')
  return product.imagePath.replace('storage/public', apiBaseUrl)
}

const selectedProduct = computed(() => {
  return products.value.find(p => p.id === props.modelValue)
})
</script>

<template>
  <div class="space-y-2">
    <div v-if="selectedProduct" class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">
      <img
        v-if="getProductImageUrl(selectedProduct)"
        :src="getProductImageUrl(selectedProduct)"
        :alt="selectedProduct.name"
        class="w-16 h-16 object-cover rounded-lg"
      />
      <div v-else class="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
        <span class="text-gray-400 text-xs">Нет фото</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-medium text-gray-900 dark:text-gray-100 truncate">
          {{ selectedProduct.name }}
        </p>
      </div>
      <BaseButton
        v-if="!disabled"
        variant="ghost"
        size="sm"
        @click="$emit('update:modelValue', null)"
      >
        ✕
      </BaseButton>
    </div>

    <div v-if="!selectedProduct && !disabled" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1">
      <button
        v-for="product in products"
        :key="product.id"
        type="button"
        :disabled="disabled"
        class="flex flex-col items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-left"
        @click="$emit('update:modelValue', product.id)"
      >
        <img
          v-if="getProductImageUrl(product)"
          :src="getProductImageUrl(product)"
          :alt="product.name"
          class="w-12 h-12 object-cover rounded-lg mb-2"
        />
        <div v-else class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg mb-2 flex items-center justify-center">
          <span class="text-gray-400 text-xs">Нет фото</span>
        </div>
        <p class="text-sm text-gray-700 dark:text-gray-300 text-center line-clamp-2">
          {{ product.name }}
        </p>
      </button>
    </div>

    <p v-if="error && !modelValue" class="text-sm text-red-500">
      Выберите товар
    </p>
  </div>
</template>