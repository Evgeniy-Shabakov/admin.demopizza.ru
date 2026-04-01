<script setup>
useHead({
  title: 'Редактирование записи стоп-листа'
})

const route = useRoute()
const stopListItemId = route.params.id
const { getStopListItem, updateStopListItem, loading } = useStopList()
const { success: showSuccess } = useToast()

const form = ref({
  productId: null,
  restaurantId: null,
  isInStopList: false
})

const stopListItem = ref(null)
const validationError = ref(null)

onMounted(async () => {
  stopListItem.value = await getStopListItem(Number(stopListItemId))
  if (stopListItem.value) {
    form.value.productId = stopListItem.value.productId
    form.value.restaurantId = stopListItem.value.restaurantId
    form.value.isInStopList = stopListItem.value.isInStopList
  }
})

const saveStopListItem = async () => {
  validationError.value = null
  const result = await updateStopListItem(Number(stopListItemId), {
    productId: form.value.productId ? Number(form.value.productId) : null,
    restaurantId: form.value.restaurantId ? Number(form.value.restaurantId) : null,
    isInStopList: form.value.isInStopList
  })
  if (result.success) {
    showSuccess('Запись успешно отредактирована')
    validationError.value = null
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form @submit.prevent="saveStopListItem" class="space-y-6">
        <FormsStopListForm 
          v-model="form" 
          :validation-error="validationError"
        />

        <div class="flex gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Сохранить
          </BaseButton>
          <NuxtLink :to="`/stop-list/${stopListItemId}`" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
