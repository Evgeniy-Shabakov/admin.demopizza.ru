<script setup>
import { PAYMENT_STATUS_TYPE } from '~/constants/paymentStatusType'

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

const getPaymentStatusClass = (status) => {
   if (status === PAYMENT_STATUS_TYPE.NO_PAID) {
      return 'text-red-600 dark:text-red-400 font-medium'
   }
   return 'text-gray-500 dark:text-gray-400'
}

const formatPhone = (phone) => {
   if (!phone) return ''
   const cleaned = phone.replace(/\D/g, '')
   if (cleaned.length === 11) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
   }
   return phone
}

const formatDateTime = (dateTimeStr) => {
   if (!dateTimeStr) return ''
   const parts = dateTimeStr.split(', ')
   if (parts.length === 2) {
      const time = parts[1]
      const dateParts = parts[0].split('.')
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
      const dateObj = new Date(formattedDate + ' ' + time)
      if (isNaN(dateObj.getTime())) return dateTimeStr
      return `${time}, ${new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(dateObj)}`
   }
   return dateTimeStr
}
</script>

<template>
   <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div class="text-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
         <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
            {{ order.orderTypeName }}
         </span>
         <div v-if="order.createdAt" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {{ formatDateTime(order.createdAt) }}
         </div>
      </div>
      <div class="flex items-start justify-between gap-4 mb-3">
         <div>
            <span class="text-lg font-semibold">{{ order.number }}</span>
            <span class="text-gray-500 dark:text-gray-400 text-sm ml-2">#{{ order.id }}</span>
            <div v-if="order.user?.phone" class="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
               {{ formatPhone(order.user.phone) }}
            </div>
         </div>
          <div class="flex flex-col items-end gap-1">
            <span :class="['px-3 py-1.5 rounded-lg text-sm font-semibold', getStatusClass(order.orderStatus)]">
               {{ order.orderStatus }}
            </span>
            <div class="text-right">
               <span :class="getPaymentStatusClass(order.paymentStatus)" class="text-xs block">{{ order.paymentStatus || '—' }}</span>
               <span v-if="order.paymentType" class="text-xs text-gray-500 dark:text-gray-400">{{ order.paymentType }}</span>
            </div>
         </div>
      </div>

      <div class="grid grid-cols-3 gap-2 text-sm py-3 mb-3 border-b border-gray-200 dark:border-gray-700">
         <div v-if="order.cityName">
            <span class="text-gray-500 dark:text-gray-400 text-xs">Город</span>
            <div class="font-medium">{{ order.cityName }}</div>
         </div>
         <div v-if="order.restaurantName">
            <span class="text-gray-500 dark:text-gray-400 text-xs">Ресторан</span>
            <div class="font-medium">{{ order.restaurantName }}</div>
         </div>
         <div v-if="order.deliveryZoneName">
            <span class="text-gray-500 dark:text-gray-400 text-xs">Зона доставки</span>
            <div class="font-medium">{{ order.deliveryZoneName }}</div>
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