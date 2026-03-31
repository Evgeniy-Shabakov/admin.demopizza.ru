<script setup>
useHead({
   title: 'Товары'
})

const router = useRouter()
const { sortedProducts, loading, fetchProducts, deleteProduct } = useProducts()
const { success: showSuccess } = useToast()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl.replace('/api/v1', '')

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

const getImageUrl = (imagePath) => {
   if (!imagePath) return null
   return imagePath.replace('storage/public', apiBaseUrl)
}

const columns = [
   { key: 'id', label: 'ID' },
   {
      key: 'image', label: 'Изображение', align: 'center', render: (item) => {
         const url = getImageUrl(item.imagePath)
         return url ? `<div class="flex justify-center"><img src="${url}" class="w-12 h-12 object-cover rounded" /></div>` : '<span class="text-gray-400">—</span>'
      }
   },
   { key: 'name', label: 'Название', bold: true },
   { key: 'category.name', label: 'Категория' },
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
   <UiListTable :items="sortedProducts"
                :columns="columns"
                :loading="loading"
                empty-text="Товары не найдены"
                view-link-prefix="/products"
                edit-link-prefix="/products"
                delete-label="товар"
                @row-click="handleRowClick"
                @delete="handleDelete" />
</template>
