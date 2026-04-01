<script setup>
useHead({
  title: 'Стоп-лист'
})

const router = useRouter()
const { stopListItems, loading, fetchStopList, deleteStopListItem } = useStopList()
const { success: showSuccess } = useToast()

onMounted(() => {
  fetchStopList()
})

const handleRowClick = (id) => {
  router.push(`/stop-list/${id}`)
}

const handleDelete = async (item) => {
  const result = await deleteStopListItem(item.id)
  if (result) {
    showSuccess('Запись успешно удалена из стоп-листа')
  }
}

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl.replace('/api/v1', '')

const getProductImage = (item) => {
  if (item.product?.imagePath) {
    return item.product.imagePath.replace('storage/public', apiBaseUrl)
  }
  return null
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'product', label: 'Товар', bold: true, render: (item) => {
    const imgUrl = getProductImage(item)
    const name = item.product?.name || item.productId
    const imgHtml = imgUrl 
      ? `<img src="${imgUrl}" class="w-10 h-10 object-cover rounded" alt="product" />`
      : `<div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>`
    return `<div class="flex items-center gap-3">${imgHtml}<span>${name}</span></div>`
  }},
  { key: 'restaurantName', label: 'Ресторан', bold: true, render: (item) => item.restaurant?.name || item.restaurantId },
  { key: 'isInStopList', label: 'В стоп-листе', render: (item) => item.isInStopList ? '<span class="text-red-600">Да</span>' : '<span class="text-green-600">Нет</span>' },
  { key: 'createdAt', label: 'Создано', showInMobile: false },
  { key: 'updatedAt', label: 'Обновлено', showInMobile: false },
  { key: 'actions', label: 'Действия', sticky: true, showInMobile: false }
]
</script>

<template>
  <UiListTable
    :items="stopListItems"
    :columns="columns"
    :loading="loading"
    empty-text="Записи в стоп-листе не найдены"
    view-link-prefix="/stop-list"
    edit-link-prefix="/stop-list"
    delete-label="запись"
    @row-click="handleRowClick"
    @delete="handleDelete"
  />
</template>
