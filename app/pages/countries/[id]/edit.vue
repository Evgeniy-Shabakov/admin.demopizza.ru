<script setup>
useHead({
  title: 'Редактирование страны'
})

const route = useRoute()
const countryId = route.params.id
const { getCountry, updateCountry, loading } = useCountries()
const { success: showSuccess } = useToast()

const form = ref({
  name: ''
})

const country = ref(null)
const validationError = ref(null)

onMounted(async () => {
  country.value = await getCountry(Number(countryId))
  if (country.value) {
    form.value.name = country.value.name
  }
})

const saveCountry = async () => {
  validationError.value = null
  const result = await updateCountry(Number(countryId), form.value.name)
  if (result.success) {
    showSuccess('Страна успешно отредактирована')
    validationError.value = null
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form @submit.prevent="saveCountry" class="space-y-6">
        <FormsCountryForm v-model="form" :validation-error="validationError" />

        <div class="flex gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Сохранить
          </BaseButton>
          <NuxtLink :to="`/countries/${countryId}`" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
