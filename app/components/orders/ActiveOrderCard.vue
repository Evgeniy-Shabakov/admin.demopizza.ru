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

const getProductImageUrl = (product) => {
   if (!product?.imagePath) return null
   const config = useRuntimeConfig()
   const apiBaseUrl = config.public.apiBaseUrl.replace('/api/v1', '')
   return product.imagePath.replace('storage/public', apiBaseUrl)
}
</script>

<template>
   <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
       <div class="text-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
             {{ order.orderTypeName }}
          </span>
       </div>
      <div class="flex items-start justify-between gap-4 mb-3">
         <div>
            <span class="text-lg font-semibold">{{ order.number }}</span>
            <span class="text-gray-500 dark:text-gray-400 text-sm ml-2">#{{ order.id }} ({{ order.createdAt?.split(', ')[1]?.slice(0, 5) || '' }})</span>
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

      <div v-if="order.orderProducts && order.orderProducts.length" class="border-t border-gray-200 dark:border-gray-700 pt-3">
         <div v-for="item in order.orderProducts" :key="item.productId" class="flex items-center gap-3 py-2">
            <img v-if="getProductImageUrl(item.product)" :src="getProductImageUrl(item.product)" :alt="item.product.name" class="w-10 h-10 rounded-lg object-cover">
            <div class="flex-1">
               <span>{{ item.product?.name }}</span>
            </div>
            <div class="text-right text-sm">
               <span class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ item.quantity }} шт.</span>
               <div class="text-xs text-gray-500 dark:text-gray-400">({{ item.quantity }} × {{ item.price }}) {{ item.price * item.quantity }} ₽</div>
            </div>
         </div>
      </div>

      <div v-if="order.totalProductsPrice !== undefined || order.totalPrice !== undefined" class="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 space-y-1">
         <div v-if="order.totalProductsPrice !== undefined" class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Товары</span>
            <span class="text-gray-900 dark:text-gray-100">{{ order.totalProductsPrice }} ₽</span>
         </div>
         <div v-if="order.deliveryPrice !== undefined && order.deliveryPrice > 0" class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Доставка</span>
            <span class="text-gray-900 dark:text-gray-100">{{ order.deliveryPrice }} ₽</span>
         </div>
         <div v-if="order.bonusCoinsPaid !== undefined && order.bonusCoinsPaid > 0" class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Оплачено бонусами</span>
            <span class="text-amber-600 dark:text-amber-400">-{{ order.bonusCoinsPaid }}</span>
         </div>
         <div v-if="order.totalPrice !== undefined" class="flex justify-between text-base font-semibold pt-1">
            <span class="text-gray-900 dark:text-gray-100">Итого</span>
            <span class="text-gray-900 dark:text-gray-100">{{ order.totalPrice }} ₽</span>
         </div>
         <div v-if="order.bonusCoinsEarned !== undefined && order.bonusCoinsEarned > 0" class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Будет начислено бонусов</span>
            <span class="text-green-600 dark:text-green-400">+{{ order.bonusCoinsEarned }}</span>
         </div>
      </div>
   </div>
</template>