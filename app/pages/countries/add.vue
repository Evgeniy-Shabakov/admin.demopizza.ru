<script setup>
useHead({
  title: 'Добавить страну'
})

const { createCountry, loading } = useCountries()
const { success: showSuccess } = useToast()

const form = ref({
  name: ''
})

const formRef = ref(null)
const validationError = ref(null)

const handleSaveAndAdd = async () => {
  if (formRef.value?.reportValidity()) {
    await saveCountry(false)
  }
}

const saveCountry = async (navigateToList = false) => {
  validationError.value = null
  const result = await createCountry(form.value.name)
  if (result.success) {
    showSuccess('Страна успешно добавлена')
    validationError.value = null
    if (navigateToList) {
      navigateTo('/countries')
    } else {
      form.value.name = ''
    }
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="saveCountry(true)" class="space-y-6">
        <FormsCountryForm v-model="form" :validation-error="validationError" />

        <div class="flex flex-wrap gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Добавить
          </BaseButton>
          <BaseButton type="button" :loading="loading" @click="handleSaveAndAdd">
            Добавить и добавить еще
          </BaseButton>
          <NuxtLink to="/countries" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
