<script setup>
useHead({
  title: 'Добавить в стоп-лист'
})

const { createStopListItem, loading } = useStopList()
const { success: showSuccess } = useToast()

const form = ref({
  productId: null,
  restaurantId: null,
  isInStopList: true
})

const formRef = ref(null)
const validationError = ref(null)

const handleSaveAndAdd = async () => {
  if (formRef.value?.reportValidity()) {
    await saveStopListItem(false)
  }
}

const saveStopListItem = async (navigateToList = false) => {
  validationError.value = null
  const result = await createStopListItem({
    productId: form.value.productId ? Number(form.value.productId) : null,
    restaurantId: form.value.restaurantId ? Number(form.value.restaurantId) : null,
    isInStopList: form.value.isInStopList
  })
  if (result.success) {
    showSuccess('Запись успешно добавлена в стоп-лист')
    validationError.value = null
    if (navigateToList) {
      navigateTo('/stop-list')
    } else {
      form.value.productId = null
      form.value.restaurantId = null
      form.value.isInStopList = true
    }
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="saveStopListItem(true)" class="space-y-6">
        <FormsStopListForm 
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
          <NuxtLink to="/stop-list" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
