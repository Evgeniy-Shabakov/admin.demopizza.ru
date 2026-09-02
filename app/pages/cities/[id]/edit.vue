<script setup>
useHead({
  title: 'Редактирование города'
})

const route = useRoute()
const cityId = route.params.id
const { getCity, updateCity, loading } = useCities()
const { fetchCountries, countries } = useCountries()
const { success: showSuccess } = useToast()

const form = ref({
  name: '',
  countryId: null,
  mapIframe: ''
})

const city = ref(null)
const validationError = ref(null)

onMounted(async () => {
  await fetchCountries()
  city.value = await getCity(Number(cityId))
  if (city.value) {
    form.value.name = city.value.name
    form.value.countryId = city.value.countryId
    form.value.mapIframe = city.value.mapIframe
  }
})

const saveCity = async () => {
  validationError.value = null
  const result = await updateCity(Number(cityId), {
    name: form.value.name,
    countryId: form.value.countryId,
    mapIframe: form.value.mapIframe
  })
  if (result.success) {
    showSuccess('Город успешно отредактирован')
    validationError.value = null
  } else if (result.validationError) {
    validationError.value = result.validationError
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <BaseCard>
      <form @submit.prevent="saveCity" class="space-y-6">
        <FormsCityForm 
          v-model="form" 
          :countries="countries" 
          :validation-error="validationError"
        />

        <div class="flex gap-4 pt-4">
          <BaseButton type="submit" :loading="loading">
            Сохранить
          </BaseButton>
          <NuxtLink :to="`/cities/${cityId}`" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
