<script setup>
useHead({
  title: 'Категории'
})

const router = useRouter()
const { sortedCategories, loading, fetchCategories, deleteCategory } = useCategories()
const { success: showSuccess } = useToast()

onMounted(() => {
  fetchCategories()
})

const handleRowClick = (id) => {
  router.push(`/categories/${id}`)
}

const handleDelete = async (item) => {
  const result = await deleteCategory(item.id)
  if (result) {
    showSuccess('Категория успешно удалена')
  }
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Название', bold: true },
  { key: 'position', label: 'Позиция', showInMobile: false },
  { key: 'createdAt', label: 'Создано', showInMobile: false },
  { key: 'updatedAt', label: 'Обновлено', showInMobile: false },
  { key: 'actions', label: 'Действия', sticky: true, showInMobile: false }
]
</script>

<template>
  <UiListTable
    :items="sortedCategories"
    :columns="columns"
    :loading="loading"
    empty-text="Категории не найдены"
    view-link-prefix="/categories"
    edit-link-prefix="/categories"
    delete-label="категорию"
    @row-click="handleRowClick"
    @delete="handleDelete"
  />
</template>
