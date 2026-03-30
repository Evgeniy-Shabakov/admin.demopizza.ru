<script setup>
useHead({
  title: 'Добавить город'
})

const { createCity, loading } = useCities()
const { fetchCountries, countries } = useCountries()
const { success: showSuccess } = useToast()

const form = ref({
  name: '',
  countryId: null,
  mapIframe: ''
})

const formRef = ref(null)
const validationError = ref(null)

onMounted(() => {
  fetchCountries()
})

const handleSaveAndAdd = async () => {
  if (formRef.value?.reportValidity()) {
    await saveCity(false)
  }
}

const saveCity = async (navigateToList = false) => {
  validationError.value = null
  const result = await createCity({
    name: form.value.name,
    countryId: form.value.countryId,
    mapIframe: form.value.mapIframe
  })
  if (result.success) {
    showSuccess('Город успешно добавлен')
    validationError.value = null
    if (navigateToList) {
      navigateTo('/cities')
    } else {
      form.value.name = ''
      form.value.countryId = null
      form.value.mapIframe = ''
    }
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form ref="formRef" @submit.prevent="saveCity(true)" class="space-y-6">
        <FormsCityForm 
          v-model="form" 
          :countries="countries" 
          :validation-error="validationError" 
        />

        <div class="flex flex-wrap gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Добавить
          </BaseButton>
          <BaseButton type="button" :loading="loading" @click="handleSaveAndAdd">
            Добавить и добавить еще
          </BaseButton>
          <NuxtLink to="/cities" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
