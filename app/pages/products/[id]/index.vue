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
    </BaseCard>
  </div>
</template>
