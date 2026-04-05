<script setup>
import { ORDER_STATUS } from '~/constants/orderStatus'
import { PAYMENT_STATUS_TYPE } from '~/constants/paymentStatusType'

useHead({
   title: 'Все заказы'
})

const { allOrders, allOrdersLoading, allOrdersPagination, perPageOptions, fetchAllOrders } = useOrders()

const loadPage = (page) => {
   fetchAllOrders(page)
}

const changePerPage = (event) => {
   const perPage = parseInt(event.target.value)
   fetchAllOrders(1, perPage)
}

onMounted(() => {
   fetchAllOrders(1)
})

const showPagination = computed(() => {
   return allOrdersPagination.value.total > 0
})

const visiblePages = computed(() => {
   const total = allOrdersPagination.value.lastPage
   const current = allOrdersPagination.value.currentPage
   const pages = []
   
   if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i)
   } else {
      pages.push(1)
      
      if (current > 3) {
         pages.push('...')
      }
      
      const start = Math.max(2, current - 1)
      const end = Math.min(total - 1, current + 1)
      
      for (let i = start; i <= end; i++) {
         pages.push(i)
      }
      
      if (current < total - 2) {
         pages.push('...')
      }
      
      pages.push(total)
   }
   
   return pages
})

const formatPrice = (value) => {
   if (value === null || value === undefined) return '—'
   return `${value} ₽`
}

const formatPhone = (phone) => {
   if (!phone) return '—'
   const cleaned = phone.replace(/\D/g, '')
   if (cleaned.length === 11) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
   }
   return phone
}

const getStatusClass = (status) => {
   if (status === ORDER_STATUS.CREATED) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
   }
   if (status === ORDER_STATUS.COMPLETED) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
   }
   if (status === ORDER_STATUS.CANCEL) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
   }
   return 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400'
}

const getPaymentStatusClass = (status) => {
   if (status === PAYMENT_STATUS_TYPE.NO_PAID) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
   }
   if (status === PAYMENT_STATUS_TYPE.PAID) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
   }
   return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const columns = [
   { key: 'id', label: 'ID' },
   { key: 'number', label: 'Номер' },
   { key: 'orderStatus', label: 'Статус', render: (item) => `<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(item.orderStatus)}">${item.orderStatus || '—'}</span>`, mobileLabel: 'Статус' },
   { key: 'paymentStatus', label: 'Оплата', render: (item) => `<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusClass(item.paymentStatus)}">${item.paymentStatus || '—'}</span>`, mobileLabel: 'Оплата' },
   { key: 'totalPrice', label: 'Сумма', render: (item) => formatPrice(item.totalPrice || item.totalPr), align: 'right', mobileLabel: 'Сумма' },
   { key: 'city', label: 'Город', render: (item) => item.city?.name || '—', mobileLabel: 'Город' },
   { key: 'restaurant', label: 'Ресторан', render: (item) => item.restaurant?.name || '—', showInMobile: false },
   { key: 'phone', label: 'Телефон', render: (item) => formatPhone(item.user?.phone), mobileLabel: 'Телефон' },
   { key: 'orderTypeName', label: 'Тип', render: (item) => item.orderTypeName || '—', mobileLabel: 'Тип' },
   { key: 'createdAt', label: 'Создан', showInMobile: false },
]
</script>

<template>
   <UiListTable :items="allOrders"
                :columns="columns"
                :loading="allOrdersLoading"
                empty-text="Заказы не найдены" />

   <div v-if="showPagination" class="mt-4 flex flex-col items-center gap-3">
      <div class="flex items-center justify-center gap-2">
         <button 
            :disabled="!allOrdersPagination.hasPrevPage"
            :class="[
               'px-3 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed',
               allOrdersPagination.currentPage === 1 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
            ]"
            @click="loadPage(allOrdersPagination.currentPage - 1)"
         >
            ← Назад
         </button>

         <div class="hidden sm:flex items-center gap-1">
            <template v-for="page in visiblePages" :key="page">
               <span v-if="page === '...'" class="px-2 py-2 text-gray-400 text-sm">...</span>
               <button 
                  v-else
                  :class="[
                     'px-3 py-2 rounded-lg transition-colors text-sm cursor-pointer',
                     allOrdersPagination.currentPage === page 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  ]"
                  @click="loadPage(page)"
               >
                  {{ page }}
               </button>
            </template>
         </div>

         <span class="sm:hidden text-sm text-gray-500 dark:text-gray-400">
            {{ allOrdersPagination.currentPage }}/{{ allOrdersPagination.lastPage }}
         </span>

         <button 
            :disabled="!allOrdersPagination.hasNextPage"
            :class="[
               'px-3 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed',
               allOrdersPagination.currentPage === allOrdersPagination.lastPage
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
            ]"
            @click="loadPage(allOrdersPagination.currentPage + 1)"
         >
            Вперёд →
         </button>
      </div>

      <div class="text-center text-sm text-gray-500 dark:text-gray-400">
         Страница {{ allOrdersPagination.currentPage }} из {{ allOrdersPagination.lastPage }} ({{ allOrdersPagination.total }} записей)
      </div>

      <div class="flex items-center gap-2">
         <span class="text-xs text-gray-500 dark:text-gray-400">Показывать по:</span>
         <select 
            :value="allOrdersPagination.perPage"
            @change="changePerPage"
            class="px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
         >
            <option v-for="option in perPageOptions" :key="option" :value="option">
               {{ option }}
            </option>
         </select>
      </div>
   </div>
</template>