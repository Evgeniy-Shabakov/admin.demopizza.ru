<script setup>
useHead({
   title: 'Активные заказы'
})

const { orders, loading, fetchActiveOrders } = useOrders()

onMounted(() => {
   fetchActiveOrders()
   setInterval(fetchActiveOrders, 30000)
})

const formatDate = (dateStr) => {
   if (!dateStr) return '—'
   const date = new Date(dateStr)
   if (isNaN(date.getTime())) return '—'
   return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
   }).format(date)
}

const getStatusClass = (status) => {
   const classes = {
      'new': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'cooking': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'ready': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'delivering': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'completed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
   }
   return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
}

const getStatusLabel = (status) => {
   const labels = {
      'new': 'Новый',
      'cooking': 'Готовится',
      'ready': 'Готов',
      'delivering': 'Доставляется',
      'completed': 'Завершён',
      'cancelled': 'Отменён',
   }
   return labels[status] || status
}

const columns = [
   { key: 'id', label: 'ID', width: 'w-16' },
   { key: 'orderNumber', label: 'Номер', bold: true },
   { key: 'status', label: 'Статус', render: (item) => `<span class="px-2 py-1 rounded text-xs font-medium ${getStatusClass(item.status)}">${getStatusLabel(item.status)}</span>` },
   { key: 'restaurant.name', label: 'Ресторан', mobileLabel: 'Ресторан' },
   { key: 'totalPrice', label: 'Сумма', render: (item) => item.totalPrice ? `${item.totalPrice} ₽` : '—' },
   { key: 'createdAt', label: 'Создан', render: (item) => formatDate(item.createdAt) },
   { key: 'updatedAt', label: 'Обновлён', render: (item) => formatDate(item.updatedAt) },
]
</script>

<template>
   <UiListTable
      :items="orders"
      :columns="columns"
      :loading="loading"
      empty-text="Активные заказы не найдены"
   />
</template>