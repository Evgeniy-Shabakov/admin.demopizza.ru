<script setup>
import { ORDER_STATUS } from '~/constants/orderStatus'
import { ORDER_STATUS_NAME_BY_ID } from '~/constants/orderStatus'
import { ORDER_TYPE } from '~/constants/orderType'
import { ORDER_TYPE_NAME_BY_ID } from '~/constants/orderType'
import { PAYMENT_TYPE } from '~/constants/paymentType'
import { PAYMENT_TYPE_NAME_BY_ID } from '~/constants/paymentType'
import { PAYMENT_STATUS } from '~/constants/paymentStatus'
import { PAYMENT_STATUS_NAME_BY_ID } from '~/constants/paymentStatus'

useHead({
   title: 'Все заказы'
})

const router = useRouter()
const { allOrders, allOrdersLoading, allOrdersPagination, perPageOptions, fetchAllOrders } = useOrders()
const { currentCityId, currentRestaurantId } = useGlobalCityRestaurant()

onMounted(() => {
   fetchAllOrders(1, 25, currentCityId.value, currentRestaurantId.value)
})

const handleRowClick = (id) => {
   router.push(`/active-orders/${id}`)
}

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
   if (status === ORDER_STATUS.CREATED.ID) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
   }
   if (status === ORDER_STATUS.COMPLETED.ID) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
   }
   if (status === ORDER_STATUS.CANCEL.ID) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
   }
   return 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400'
}

const getPaymentStatusClass = (status) => {
   if (status === PAYMENT_STATUS.NO_PAID.ID) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
   }
   if (status === PAYMENT_STATUS.PAID.ID) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
   }
   return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const orderStatusName = computed(() => {
   return ORDER_STATUS_NAME_BY_ID[props.order.orderStatusId]
})

const orderTypeName = computed(() => {
   return ORDER_TYPE_NAME_BY_ID[props.order.orderTypeId]
})

const paymentTypeName = computed(() => {
   return PAYMENT_TYPE_NAME_BY_ID[props.order.paymentTypeId]
})

const paymentStatusName = computed(() => {
   return PAYMENT_STATUS_NAME_BY_ID[props.order.paymentStatusId]
})

const columns = [
   { key: 'id', label: 'ID' },
   { key: 'number', label: 'Номер', white: true, mobileLabel: 'Номер' },
   {
      key: 'orderStatus',
      label: 'Статус',
      render: (item) => `<span class="inline-flex px-2 py-1 rounded-full text-xs 
                        font-medium ${getStatusClass(item.orderStatusId)}">
                        ${ORDER_STATUS_NAME_BY_ID[item.orderStatusId]}
                        </span>`
   },
   {
      key: 'paymentStatus',
      label: 'Оплата',
      render: (item) => `<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium 
            ${getPaymentStatusClass(item.paymentStatusId)}">
            ${PAYMENT_STATUS_NAME_BY_ID[item.paymentStatusId]}
            </span>`,
   },
   {
      key: 'totalPrice',
      label: 'Сумма',
      render: (item) => formatPrice(item.totalPrice), align: 'right',
   },
   {
      key: 'city',
      label: 'Город',
      render: (item) => item.city?.name
   },
   { key: 'restaurant', label: 'Ресторан', render: (item) => item.restaurant?.name, showInMobile: false },
   { key: 'phone', label: 'Телефон', render: (item) => formatPhone(item.user?.phone)},
   { key: 'orderType', label: 'Тип', render: (item) => ORDER_TYPE_NAME_BY_ID[item.orderTypeId] },
   { key: 'createdAt', label: 'Создан', showInMobile: false, render: (item) => formatDateTime(item.createdAt) },
   { key: 'actions', label: 'Действия', sticky: true, showInMobile: false },
]
</script>

<template>
   <UiListTable :items="allOrders"
                :columns="columns"
                :loading="allOrdersLoading"
                empty-text="Заказы не найдены"
                view-link-prefix="/active-orders"
                :show-edit="false"
                :show-delete="false"
                @row-click="handleRowClick" />

   <UiPagination :pagination="allOrdersPagination"
                 :per-page-options="perPageOptions"
                 @page-change="loadPage"
                 @per-page-change="changePerPage" />
</template>
