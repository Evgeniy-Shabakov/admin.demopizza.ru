<script setup>
useHead({
  title: 'Добавить промокод'
})

const { createPromocode, loading } = usePromocodes()
const { success: showSuccess } = useToast()

const form = ref({
  bonusCoins: null,
  description: ''
})

const formRef = ref(null)
const validationError = ref(null)

const handleSaveAndAdd = async () => {
  if (formRef.value?.reportValidity()) {
    await savePromocode(false)
  }
}

const savePromocode = async (navigateToList = false) => {
  validationError.value = null
  const result = await createPromocode({
    bonusCoins: form.value.bonusCoins ? Number(form.value.bonusCoins) : null,
    description: form.value.description
  })
  if (result.success) {
    showSuccess('Промокод успешно создан')
    validationError.value = null
    if (navigateToList) {
      navigateTo('/promocodes')
    } else {
      form.value.bonusCoins = null
      form.value.description = ''
    }
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="savePromocode(true)" class="space-y-6">
        <FormsPromocodeForm 
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
          <NuxtLink to="/promocodes" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>