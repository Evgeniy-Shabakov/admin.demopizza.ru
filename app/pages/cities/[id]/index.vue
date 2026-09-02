<script setup>
useHead({
  title: 'Просмотр города'
})

const route = useRoute()
const cityId = route.params.id
const { getCity, loading } = useCities()
const { fetchCountries, countries } = useCountries()

const city = ref(null)

onMounted(async () => {
  await Promise.all([
    getCity(Number(cityId)),
    fetchCountries()
  ])
  city.value = await getCity(Number(cityId))
})

const getCountryName = (countryId) => {
  const country = countries.value.find(c => c.id === countryId)
  return country?.name || '—'
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <BaseCard v-else-if="city">
      <FormsCityForm 
        :city="city" 
        disabled 
        :show-details="true" 
        :countries="countries"
      />
    </BaseCard>

    <BaseCard v-else>
      <p class="text-gray-500 dark:text-gray-400 text-center">Город не найден</p>
    </BaseCard>
  </div>
</template>
