<script setup>
import { ORDER_STATUS } from '~/constants/orderStatus'
import { PAYMENT_STATUS_TYPE } from '~/constants/paymentStatusType'

useHead({
   title: 'Все заказы'
})

const { allOrders, allOrdersLoading, allOrdersPagination, perPageOptions, fetchAllOrders } = useOrders()

onMounted(() => {
   fetchAllOrders(1)
})

const loadPage = (page) => {
   fetchAllOrders(page)
}

const changePerPage = (perPage) => {
   fetchAllOrders(1, perPage)
}

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

   <UiPagination 
      :pagination="allOrdersPagination"
      :per-page-options="perPageOptions"
      @page-change="loadPage"
      @per-page-change="changePerPage"
   />
</template>
