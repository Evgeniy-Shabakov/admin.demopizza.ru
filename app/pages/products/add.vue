<script setup>
useHead({
  title: 'Добавить товар'
})

const { createProduct, loading } = useProducts()
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

const formRef = ref(null)
const validationError = ref(null)

const handleSaveAndAdd = async () => {
  if (formRef.value?.reportValidity()) {
    await saveProduct(false)
  }
}

const saveProduct = async (navigateToList = false) => {
  validationError.value = null
  const result = await createProduct({
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
    showSuccess('Товар успешно добавлен')
    validationError.value = null
    if (navigateToList) {
      navigateTo('/products')
    } else {
      form.value.name = ''
      form.value.categoryId = null
      form.value.priceDefault = null
      form.value.bonusCoinsDefault = null
      form.value.descriptionShort = ''
      form.value.descriptionFull = ''
      form.value.positionInCategory = null
      form.value.imageFile = null
      form.value.isActive = true
    }
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="saveProduct(true)" class="space-y-6">
        <FormsProductForm 
          v-model="form" 
          :validation-error="validationError" 
        />

        <div class="flex flex-wrap gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Добавить
          </BaseButton>
          <BaseButton type="button" :loading="loading" @click="handleSaveAndAdd">
            Добавить и добавить еще
          </BaseButton>
          <NuxtLink to="/products" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
