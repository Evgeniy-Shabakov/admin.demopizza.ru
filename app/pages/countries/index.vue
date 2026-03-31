<script setup>
useHead({
  title: 'Страны'
})

const router = useRouter()
const { countries, loading, fetchCountries, deleteCountry } = useCountries()
const { success: showSuccess } = useToast()

onMounted(() => {
  fetchCountries()
})

const handleRowClick = (id) => {
  router.push(`/countries/${id}`)
}

const handleDelete = async (item) => {
  const result = await deleteCountry(item.id)
  if (result) {
    showSuccess('Страна успешно удалена')
  }
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Название', bold: true },
  { key: 'createdAt', label: 'Создано', showInMobile: false },
  { key: 'updatedAt', label: 'Обновлено', showInMobile: false },
  { key: 'actions', label: 'Действия', sticky: true, showInMobile: false }
]
</script>

<template>
  <UiListTable
    :items="countries"
    :columns="columns"
    :loading="loading"
    empty-text="Страны не найдены"
    view-link-prefix="/countries"
    edit-link-prefix="/countries"
    delete-label="страну"
    @row-click="handleRowClick"
    @delete="handleDelete"
  />
</template>
