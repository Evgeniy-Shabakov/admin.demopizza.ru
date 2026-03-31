<script setup>
useHead({
  title: 'Товар'
})

const route = useRoute()
const { getProduct, loading, loading: isLoading } = useProducts()

const product = ref(null)

onMounted(async () => {
  product.value = await getProduct(route.params.id)
})
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <FormsProductForm 
        :product="product" 
        :disabled="true"
        :show-details="true"
      />

      <div class="flex flex-wrap gap-4 pt-4">
        <NuxtLink :to="`/products/${product?.id}/edit`" class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
          Редактировать
        </NuxtLink>
        <NuxtLink to="/products" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors">
          Назад
        </NuxtLink>
      </div>
    </BaseCard>
  </div>
</template>
