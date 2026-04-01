<script setup>
defineProps({
   order: {
      type: Object,
      required: true
   }
})

const getStatusClass = (status) => {
   const classes = {
      'создан': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'cooking': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'ready': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'delivering': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'completed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
   }
   return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
}

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
</script>

<template>
   <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between gap-4 mb-3">
         <div>
            <span class="text-lg font-semibold">{{ order.number }}</span>
            <span class="text-gray-500 dark:text-gray-400 text-sm ml-2">#{{ order.id }}</span>
         </div>
         <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass(order.orderStatus)]">
            {{ order.orderStatus }}
         </span>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm mb-3">
         <div>
            <span class="text-gray-500 dark:text-gray-400">Тип:</span>
            <span class="ml-1">{{ order.orderTypeName || '—' }}</span>
         </div>
         <div>
            <span class="text-gray-500 dark:text-gray-400">Оплата:</span>
            <span class="ml-1">{{ order.paymentType || '—' }}</span>
         </div>
         <div>
            <span class="text-gray-500 dark:text-gray-400">Статус оплаты:</span>
            <span class="ml-1">{{ order.paymentStatus || '—' }}</span>
         </div>
         <div>
            <span class="text-gray-500 dark:text-gray-400">Создан:</span>
            <span class="ml-1">{{ formatDate(order.createdAt) }}</span>
         </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-3 flex items-center justify-between">
         <div class="flex gap-4 text-sm">
            <div>
               <span class="text-gray-500 dark:text-gray-400">Товары:</span>
               <span class="ml-1 font-medium">{{ order.totalProductsPrice }} ₽</span>
            </div>
            <div v-if="order.deliveryPrice">
               <span class="text-gray-500 dark:text-gray-400">Доставка:</span>
               <span class="ml-1 font-medium">{{ order.deliveryPrice }} ₽</span>
            </div>
         </div>
         <div class="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {{ order.totalPrice }} ₽
         </div>
      </div>
   </div>
</template>