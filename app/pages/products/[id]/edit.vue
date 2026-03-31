<script setup>
useHead({
  title: 'Редактировать товар'
})

const route = useRoute()
const router = useRouter()
const { getProduct, updateProduct, loading } = useProducts()
const { success: showSuccess } = useToast()

const form = ref({
  name: '',
  categoryId: null,
  priceDefault: null,
  bonusCoinsDefault: null,
  descriptionShort: '',
  descriptionFull: '',
  positionInCategory: null,
  imageFile: null,
  isActive: true
})

const product = ref(null)
const formRef = ref(null)
const validationError = ref(null)

onMounted(async () => {
  product.value = await getProduct(route.params.id)
  if (product.value) {
    form.value = {
      name: product.value.name,
      categoryId: product.value.categoryId,
      priceDefault: product.value.priceDefault,
      bonusCoinsDefault: product.value.bonusCoinsDefault,
      descriptionShort: product.value.descriptionShort || '',
      descriptionFull: product.value.descriptionFull || '',
      positionInCategory: product.value.positionInCategory,
      imageFile: null,
      isActive: product.value.isActive
    }
  }
})

const saveProduct = async () => {
  validationError.value = null
  const result = await updateProduct(route.params.id, {
    name: form.value.name,
    categoryId: form.value.categoryId ? Number(form.value.categoryId) : null,
    priceDefault: form.value.priceDefault ? Number(form.value.priceDefault) : null,
    bonusCoinsDefault: form.value.bonusCoinsDefault ? Number(form.value.bonusCoinsDefault) : null,
    descriptionShort: form.value.descriptionShort || '',
    descriptionFull: form.value.descriptionFull || '',
    positionInCategory: form.value.positionInCategory ? Number(form.value.positionInCategory) : null,
    imageFile: form.value.imageFile,
    isActive: form.value.isActive
  })
  if (result.success) {
    showSuccess('Товар успешно обновлен')
    validationError.value = null
    router.push('/products')
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="saveProduct" class="space-y-6">
        <FormsProductForm 
          v-model="form" 
          :product="product"
          :validation-error="validationError" 
        />

        <div class="flex flex-wrap gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Сохранить
          </BaseButton>
          <NuxtLink to="/products" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
