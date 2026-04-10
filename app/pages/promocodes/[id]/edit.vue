<script setup>
useHead({
  title: 'Редактирование промокода'
})

const route = useRoute()
const promocodeId = route.params.id
const { getPromocode, updatePromocode, loading } = usePromocodes()
const { success: showSuccess } = useToast()

const promocode = ref(null)

const form = ref({
  isActive: true
})

const formRef = ref(null)
const validationError = ref(null)

onMounted(async () => {
  promocode.value = await getPromocode(Number(promocodeId))
  if (promocode.value) {
    form.value.isActive = promocode.value.isActive
  }
})

const savePromocode = async () => {
  validationError.value = null
  const result = await updatePromocode(Number(promocodeId), {
    isActive: form.value.isActive
  })
  if (result.success) {
    showSuccess('Промокод успешно обновлен')
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="savePromocode" class="space-y-6">
        <FormsPromocodeForm 
          v-model="form"
          :promocode="promocode"
          :validation-error="validationError"
          :is-edit="true"
        />

        <div class="flex flex-wrap gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Сохранить
          </BaseButton>
          <NuxtLink :to="`/promocodes/${promocodeId}`" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>