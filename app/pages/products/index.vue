<script setup>
useHead({
  title: 'Товары'
})

const router = useRouter()
const { sortedProducts, loading, fetchProducts, deleteProduct } = useProducts()
const { success: showSuccess } = useToast()

onMounted(() => {
  fetchProducts()
})

const handleRowClick = (id) => {
  router.push(`/products/${id}`)
}

const handleDelete = async (item) => {
  const result = await deleteProduct(item.id)
  if (result) {
    showSuccess('Товар успешно удален')
  }
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Название', bold: true },
  { key: 'categoryName', label: 'Категория' },
  { key: 'priceDefault', label: 'Цена', render: (item) => item.priceDefault ? `${item.priceDefault} ₽` : '—' },
  { key: 'bonusCoinsDefault', label: 'Бонусы', render: (item) => item.bonusCoinsDefault || '—' },
  { key: 'isActive', label: 'Активен', render: (item) => item.isActive ? 'Да' : 'Нет' },
  { key: 'positionInCategory', label: 'Позиция', showInMobile: false },
  { key: 'createdAt', label: 'Создано', showInMobile: false },
  { key: 'updatedAt', label: 'Обновлено', showInMobile: false },
  { key: 'actions', label: 'Действия', sticky: true, showInMobile: false }
]
</script>

<template>
  <UiListTable
    :items="sortedProducts"
    :columns="columns"
    :loading="loading"
    empty-text="Товары не найдены"
    view-link-prefix="/products"
    edit-link-prefix="/products"
    delete-label="товар"
    @row-click="handleRowClick"
    @delete="handleDelete"
  />
</template>
