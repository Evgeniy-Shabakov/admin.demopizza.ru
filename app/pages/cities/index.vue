<script setup>
useHead({
  title: 'Города'
})

const router = useRouter()
const { cities, loading, fetchCities, deleteCity } = useCities()
const { fetchCountries, countries } = useCountries()
const { success: showSuccess } = useToast()

onMounted(() => {
  fetchCities()
  fetchCountries()
})

const handleRowClick = (id) => {
  router.push(`/cities/${id}`)
}

const handleDelete = async (item) => {
  const result = await deleteCity(item.id)
  if (result) {
    showSuccess('Город успешно удалён')
  }
}

const getCountryName = (countryId) => {
  const country = countries.value.find(c => c.id === countryId)
  return country?.name || '—'
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Название', bold: true },
  { key: 'country', label: 'Страна', render: (item) => getCountryName(item.countryId), mobileLabel: 'Страна' },
  { 
    key: 'map', 
    label: 'Карта', 
    align: 'center',
    render: (item) => item.mapIframe 
      ? '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30"><svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></span>'
      : '<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></span>',
    showInMobile: false
  },
  { key: 'createdAt', label: 'Создано', showInMobile: false },
  { key: 'updatedAt', label: 'Обновлено', showInMobile: false },
  { key: 'actions', label: 'Действия', sticky: true, showInMobile: false }
]
</script>

<template>
  <UiListTable
    :items="cities"
    :columns="columns"
    :loading="loading"
    empty-text="Города не найдены"
    view-link-prefix="/cities"
    edit-link-prefix="/cities"
    delete-label="город"
    @row-click="handleRowClick"
    @delete="handleDelete"
  />
</template>
