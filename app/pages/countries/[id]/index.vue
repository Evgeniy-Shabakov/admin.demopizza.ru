<script setup>
useHead({
  title: 'Просмотр страны'
})

const route = useRoute()
const countryId = route.params.id
const { getCountry, loading } = useCountries()

const country = ref(null)

onMounted(async () => {
  country.value = await getCountry(Number(countryId))
})
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <BaseCard v-else-if="country">
      <FormsCountryForm :country="country" disabled :show-details="true" />
    </BaseCard>

    <BaseCard v-else>
      <p class="text-gray-500 dark:text-gray-400 text-center">Страна не найдена</p>
    </BaseCard>
  </div>
</template>
