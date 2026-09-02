<script setup>
import { ORDER_STATUS } from '~/constants/orderStatus'
import { ORDER_STATUS_NAME_BY_ID } from '~/constants/orderStatus'
import { ORDER_TYPE } from '~/constants/orderType'
import { ORDER_TYPE_NAME_BY_ID } from '~/constants/orderType'
import { PAYMENT_TYPE } from '~/constants/paymentType'
import { PAYMENT_TYPE_NAME_BY_ID } from '~/constants/paymentType'
import { PAYMENT_STATUS } from '~/constants/paymentStatus'
import { PAYMENT_STATUS_NAME_BY_ID } from '~/constants/paymentStatus'
import { useToast } from '~/composables/useToast'
import { onMounted, onUnmounted } from 'vue'
import BaseModal from '~/components/base/BaseModal.vue'
import BaseButton from '~/components/base/BaseButton.vue'

const props = defineProps({
   order: {
      type: Object,
      required: true
   }
})

const emit = defineEmits(['status-changed', 'view'])

const { showToast } = useToast()
const { $api } = useNuxtApp()

const isLoadingNext = ref(false)
const isLoadingPrev = ref(false)
const isLoadingCancel = ref(false)
const isLoadingPayment = ref(false)
const showDropdown = ref(false)
const showCancelModal = ref(false)
const showPaymentModal = ref(false)
const showRestaurantModal = ref(false)
const isLoadingRestaurant = ref(false)
const cities = ref([])
const restaurants = ref([])
const selectedCityId = ref(null)
const selectedRestaurantId = ref(null)

const canChangePayment = computed(() => {
   return props.order.paymentTypeId !== PAYMENT_TYPE.ONLINE.ID
})

const totalItemsCount = computed(() => {
   if (!props.order.orderProducts) return 0
   return props.order.orderProducts.reduce((sum, item) => sum + item.quantity, 0)
})

const positionsCount = computed(() => {
   return props.order.orderProducts?.length || 0
})

const toggleDropdown = () => {
   showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
   showDropdown.value = false
}

onMounted(() => {
   document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
   document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event) => {
   const dropdown = event.target.closest('.dropdown-container')
   if (!dropdown && showDropdown.value) {
      showDropdown.value = false
   }
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

async function nextStatus() {
   isLoadingNext.value = true
   try {
      const response = await $api.patch(`/orders/${props.order.id}/next-status`)
      props.order.orderStatusId = response.data.data.orderStatusId
   } catch (e) {
      showToast('Ошибка изменения статуса', 'error')
      console.error(e)
   } finally {
      isLoadingNext.value = false
   }
}

async function prevStatus() {
   isLoadingPrev.value = true
   try {
      const response = await $api.patch(`/orders/${props.order.id}/previous-status`)
      props.order.orderStatusId = response.data.data.orderStatusId
   } catch (e) {
      showToast('Ошибка изменения статуса', 'error')
      console.error(e)
   } finally {
      isLoadingPrev.value = false
   }
}

async function cancelOrder() {
   isLoadingCancel.value = true
   try {
      await $api.patch(`/orders/${props.order.id}`, {
         orderStatusId: ORDER_STATUS.CANCEL.ID
      })
      showToast('Заказ отменён', 'success')
      props.order.orderStatusId = ORDER_STATUS.CANCEL.ID
      showCancelModal.value = false
   } catch (e) {
      showToast('Ошибка отмены заказа', 'error')
      console.error(e)
   } finally {
      isLoadingCancel.value = false
   }
}

const updatePaymentStatus = async () => {
   isLoadingPayment.value = true
   try {
      const newStatus = props.order.paymentStatusId === PAYMENT_STATUS.NO_PAID.ID
         ? PAYMENT_STATUS.PAID.ID
         : PAYMENT_STATUS.NO_PAID.ID
      await $api.patch(`/orders/${props.order.id}`, { paymentStatusId: newStatus })
      showToast('Статус оплаты изменён', 'success')
      props.order.paymentStatusId = newStatus
      showPaymentModal.value = false
   } catch (e) {
      showToast('Ошибка изменения статуса оплаты', 'error')
      console.error(e)
   } finally {
      isLoadingPayment.value = false
   }
}

const viewOrder = () => {
   emit('view', props.order)
}

const openRestaurantModal = async () => {
   closeDropdown()
   selectedCityId.value = props.order.city?.id || null
   selectedRestaurantId.value = props.order.restaurant?.id || null

   try {
      const response = await $api.get('/cities')
      cities.value = response.data?.data || []

      const restaurantsResponse = await $api.get('/restaurants')
      const allRestaurants = restaurantsResponse.data?.data || []

      if (selectedCityId.value) {
         restaurants.value = allRestaurants.filter(r => r.cityId === selectedCityId.value)
      } else {
         restaurants.value = allRestaurants
      }
   } catch (e) {
      console.error(e)
   }

   showRestaurantModal.value = true
}

const onCityChange = async () => {
   selectedRestaurantId.value = null
   restaurants.value = []

   if (selectedCityId.value) {
      try {
         const response = await $api.get('/restaurants')
         const allRestaurants = response.data?.data || []
         restaurants.value = allRestaurants.filter(r => r.cityId === selectedCityId.value)
      } catch (e) {
         console.error(e)
      }
   }
}

const updateRestaurant = async () => {
   isLoadingRestaurant.value = true
   try {
      await $api.patch(`/orders/${props.order.id}`, {
         cityId: selectedCityId.value,
         restaurantId: selectedRestaurantId.value
      })

      const city = cities.value.find(c => c.id === selectedCityId.value)
      const restaurant = restaurants.value.find(r => r.id === selectedRestaurantId.value)

      props.order.city = city || props.order.city
      props.order.restaurant = restaurant || props.order.restaurant

      showToast('Ресторан изменён', 'success')
      showRestaurantModal.value = false
   } catch (e) {
      showToast('Ошибка изменения ресторана', 'error')
      console.error(e)
   } finally {
      isLoadingRestaurant.value = false
   }
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

function getPaymentTypeInfo(type) {
   const types = {
      [PAYMENT_TYPE.CASH.ID]: {
         class: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
         icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
      },
      [PAYMENT_TYPE.CARD_OFFLINE.ID]: {
         class: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
         icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
      },
      [PAYMENT_TYPE.ONLINE.ID]: {
         class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
         icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
      },
      [PAYMENT_TYPE.QR_CODE_OFFLINE.ID]: {
         class: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
         icon: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7zm-7-8h3v3H7V6zm10 0h3v3h-3V6zM7 17h3v3H7v-3zm10 0h3v3h-3v-3z'
      }
   }
   return types[type] || { class: 'text-gray-500 dark:text-gray-400', icon: '' }
}

function formatPhone(phone) {
   if (!phone) return ''
   const cleaned = phone.replace(/\D/g, '')
   if (cleaned.length === 11) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
   }
   return phone
}



function formatAddress(address) {
   if (!address) return ''

   const parts = []

   if (address.addressAsString) {
      parts.push(address.addressAsString)
   }
   else {
      if (address.street) parts.push(address.street)
      if (address.house) parts.push(`д. ${address.house}`)
      if (address.corps) parts.push(`корп. ${address.corps}`)
      if (address.flat) parts.push(`кв. ${address.flat}`)
   }

   if (address.entrance) parts.push(`под. ${address.entrance}`)
   if (address.floor) parts.push(`эт. ${address.floor}`)
   if (address.entranceCode) parts.push(`код ${address.entranceCode}`)
   if (address.comment) parts.push(address.comment)

   return parts.join(', ')
}

const { getImageUrl: getProductImageUrl } = useImageUrl()
</script>

<template>
   <div>
      <div
           class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
         <div class="flex gap-2 items-center justify-between mb-2 mx-1">
            <div>
               <span class="font-semibold">{{ order.number }}</span>
               <span class="text-gray-500 dark:text-gray-400 text-xs ml-1"
                     title="внутренний номер заказа">#{{ order.id }}</span>
            </div>
            <div class="flex-1 text-center">
               <span class="text-gray-500 dark:text-gray-400 text-base"
                     title="время создания заказа">{{ formatOrderTime(order.createdAt) }}</span>
            </div>
            <div v-if="order.city?.name"
                 class="text-[11px] text-gray-500 dark:text-gray-400 text-right leading-tight">
               <div>{{ order.city.name }}</div>
               <div v-if="order.restaurant?.name"
                    class="text-[10px]">{{ order.restaurant.name }}</div>
            </div>
         </div>

         <div class="text-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between gap-2 w-full">
               <span
                     class="flex-1 inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400">
                  {{ orderTypeName }}
               </span>
               <span v-if="order.packTakeaway"
                     class="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                  <svg class="w-4 h-4"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24">
                     <path stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="2"
                           d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Упаковать
               </span>
               <span v-else
                     class="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <svg class="w-4 h-4"
                       viewBox="0 0 24 24"
                       fill="currentColor">
                     <path
                           d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
                  </svg>
                  Сервировать
               </span>
            </div>
            <div v-if="order.orderStatusId"
                 :class="['px-3 py-1.5 rounded-lg text-sm font-semibold text-center block w-full mt-3', getStatusClass(order.orderStatusId)]">
               {{ orderStatusName }}
            </div>
         </div>
         <div v-if="!order.userId"
              class="text-xs text-center mb-2 rounded px-2 py-0.5
         bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700">
            Номер не подтвержден! Перезвоните!
         </div>
         <div class="flex items-start justify-between gap-4 mb-3">
            <div>
               <div class="text-xs text-blue-600 dark:text-blue-400 mt-0.5 flex items-center gap-1">
                  <svg class="w-3 h-3 text-blue-500 dark:text-blue-400"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24">
                     <path stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="2"
                           d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ formatPhone(order.phone) }}
               </div>
               <div class="text-xs text-green-600 dark:text-green-400 mt-0.5 flex items-center gap-1">
                  <svg class="w-3 h-3 text-green-500 dark:text-green-400 shrink-0"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24">
                     <path stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="2"
                           d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                     <path stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="2"
                           d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                     {{ formatAddress(order.addressJson) }}
                     <span v-if="order.deliveryZone?.name"
                           class="text-gray-500 dark:text-gray-400"> ({{ order.deliveryZone.name }})</span>
                  </div>
               </div>
            </div>
            <div class="flex flex-col items-end gap-1 whitespace-nowrap">
               <button :disabled="!canChangePayment || isLoadingPayment"
                       @click="showPaymentModal = true"
                       :title="!canChangePayment ? 'Изменить статус оплаты вручную можно только при оплате наличными или картой офлайн' : null"
                       :class="[
                        'text-xs block rounded px-2 py-0.5 transition-colors',
                        order.paymentStatusId === PAYMENT_STATUS.PAID.ID
                           ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700'
                           : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700',
                        canChangePayment ? 'cursor-pointer' : 'cursor-not-allowed'
                     ]">
                  {{ paymentStatusName }}
               </button>
               <span v-if="order.paymentTypeId"
                     :class="getPaymentTypeInfo(order.paymentTypeId).class"
                     class="text-xs flex items-center gap-1 p-1 rounded-sm"
                     :title="`Тип оплаты: ${order.paymentType}`"
                     style="width: 82px; white-space: normal; word-break: break-word">
                  <svg class="w-3 h-3 shrink-0"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24">
                     <path stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="2"
                           :d="getPaymentTypeInfo(order.paymentTypeId).icon" />
                  </svg>
                  {{ paymentTypeName }}
               </span>
               <span v-if="order.banknoteForChange"
                     class="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded px-1.5 py-0.5 mt-1 block">Сдача
                  с: {{ order.banknoteForChange }} ₽</span>
            </div>
         </div>

         <div v-if="order.tableNumber || order.carNumber || order.leaveAtTheDoor || order.dontRingDoorbell || order.userComment"
              class="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 mb-3 flex flex-wrap gap-2">
            <div v-if="order.tableNumber"
                 class="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded px-2 py-1">
               Стол № {{ order.tableNumber }}
            </div>
            <div v-if="order.carNumber"
                 class="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded px-2 py-1">
               {{ order.carNumber }}
            </div>
            <div v-if="order.leaveAtTheDoor"
                 class="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded px-2 py-1">
               Оставить у двери
            </div>
            <div v-if="order.dontRingDoorbell"
                 class="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded px-2 py-1">
               Не звонить в дверь
            </div>

            <div v-if="order.userComment"
                 class="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded px-2 py-1"
                 title="Комментарий клиента">
               {{ order.userComment }}
            </div>
         </div>

         <div v-if="order.orderProducts && order.orderProducts.length"
              class="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div class="text-xs text-gray-500 dark:text-gray-400">
               Позиций: <span class="text-white dark:text-white">{{ positionsCount }}</span> | Товаров: <span
                     class="text-white dark:text-white">{{ totalItemsCount }}</span>
            </div>
            <div v-for="item in order.orderProducts"
                 :key="item.productId"
                 class="flex items-center gap-3 py-2">
               <img v-if="getProductImageUrl(item.product?.imagePath)"
                     :src="getProductImageUrl(item.product?.imagePath)"
                    :alt="item.product.name"
                    class="w-10 h-10 rounded-lg object-cover">
               <div class="flex-1">
                  <span>{{ item.product?.name }}</span>
               </div>
               <div class="text-right text-sm">
                  <span class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ item.quantity }} шт.</span>
                  <div class="text-xs text-gray-500 dark:text-gray-400">({{ item.quantity }} × {{ item.price }}) {{
                     item.price * item.quantity }} ₽</div>
               </div>
            </div>
         </div>

         <div v-if="order.totalProductsPrice !== undefined || order.totalPrice !== undefined"
              class="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 space-y-1">
            <div v-if="order.totalProductsPrice !== undefined"
                 class="flex justify-between text-sm">
               <span class="text-gray-500 dark:text-gray-400">Товары</span>
               <span class="text-gray-900 dark:text-gray-100">{{ order.totalProductsPrice }} ₽</span>
            </div>
            <div v-if="order.deliveryPrice !== undefined && order.deliveryPrice > 0"
                 class="flex justify-between text-sm">
               <span class="text-gray-500 dark:text-gray-400">Доставка</span>
               <span class="text-gray-900 dark:text-gray-100">{{ order.deliveryPrice }} ₽</span>
            </div>
            <div v-if="order.bonusCoinsPaid !== undefined && order.bonusCoinsPaid > 0"
                 class="flex justify-between text-sm">
               <span class="text-gray-500 dark:text-gray-400">Оплачено бонусами</span>
               <span class="text-amber-600 dark:text-amber-400">-{{ order.bonusCoinsPaid }}</span>
            </div>
            <div v-if="order.totalPrice !== undefined"
                 class="flex justify-between text-base font-semibold pt-1">
               <span class="text-gray-900 dark:text-gray-100">Итого</span>
               <span class="text-gray-900 dark:text-gray-100">{{ order.totalPrice }} ₽</span>
            </div>
            <div v-if="order.bonusCoinsEarned !== undefined && order.bonusCoinsEarned > 0"
                 class="flex justify-between text-sm">
               <span class="text-gray-500 dark:text-gray-400">Будет начислено бонусов</span>
               <span class="text-green-600 dark:text-green-400">+{{ order.bonusCoinsEarned }}</span>
            </div>
         </div>

         <div class="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
            <div v-if="order.orderStatusId"
                 :class="['px-3 py-1.5 rounded-lg text-sm font-semibold text-center block w-full', getStatusClass(order.orderStatusId)]">
               {{ orderStatusName }}
            </div>

            <div class="mt-3 flex items-center gap-2 ">
               <button @click="nextStatus"
                       :disabled="isLoadingNext"
                       class="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                  {{ isLoadingNext ? '...' : 'Следующий статус' }}
               </button>
               <NuxtLink :to="`/active-orders/${order.id}`"
                         class="hidden md:block px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors cursor-pointer text-center">
                  Просмотр
               </NuxtLink>
               <div class="relative dropdown-container">
                  <button @click="toggleDropdown"
                          class="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors cursor-pointer">
                     <svg class="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24">
                        <path
                              d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                     </svg>
                  </button>
                  <div v-if="showDropdown"
                       class="absolute right-0 mb-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 bottom-full">
                     <button @click="prevStatus(); closeDropdown()"
                             :disabled="isLoadingPrev"
                             class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 cursor-pointer">
                        {{ isLoadingPrev ? '...' : 'Предыдущий статус' }}
                     </button>
                     <button @click="showCancelModal = true; closeDropdown()"
                             :disabled="isLoadingCancel"
                             class="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 cursor-pointer">
                        {{ isLoadingCancel ? '...' : 'Отменить заказ' }}
                     </button>
                     <button @click="openRestaurantModal()"
                             class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        Изменить ресторан
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <BaseModal :show="showCancelModal"
                 @close="showCancelModal = false">
         <div class="text-center">
            <div
                 class="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30">
               <svg class="w-8 h-8 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
               Отменить заказ
            </h3>

            <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
               Вы уверены, что хотите отменить заказ <strong>#{{ order.number }}</strong>?
            </p>
         </div>

         <div class="flex gap-3">
            <BaseButton variant="secondary"
                        class="flex-1"
                        @click="showCancelModal = false">
               Отмена
            </BaseButton>
            <BaseButton variant="danger"
                        class="flex-1"
                        :loading="isLoadingCancel"
                        @click="cancelOrder">
               Отменить
            </BaseButton>
         </div>
      </BaseModal>

      <BaseModal :show="showPaymentModal"
                 @close="showPaymentModal = false">
         <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                 :class="order.paymentStatusId === PAYMENT_STATUS.PAID.ID ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'">
               <svg v-if="order.paymentStatusId === PAYMENT_STATUS.PAID.ID"
                    class="w-8 h-8 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
               <svg v-else
                    class="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
               {{ order.paymentStatusId === PAYMENT_STATUS.PAID.ID ? 'Отменить оплату' : 'Подтвердить оплату' }}
            </h3>

            <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
               Вы уверены, что хотите {{ order.paymentStatusId === PAYMENT_STATUS.PAID.ID ? 'отменить' : 'подтвердить'
               }} оплату заказа <strong>#{{ order.number }}</strong>?
            </p>
         </div>

         <div class="flex gap-3">
            <BaseButton variant="secondary"
                        class="flex-1"
                        @click="showPaymentModal = false">
               Отмена
            </BaseButton>
            <BaseButton :variant="order.paymentStatusId === PAYMENT_STATUS.PAID.ID ? 'danger' : 'success'"
                        class="flex-1"
                        :loading="isLoadingPayment"
                        @click="updatePaymentStatus">
               {{ order.paymentStatusId === PAYMENT_STATUS.PAID.ID ? 'Отменить' : 'Подтвердить' }}
            </BaseButton>
         </div>
      </BaseModal>

      <BaseModal :show="showRestaurantModal"
                 @close="showRestaurantModal = false">
         <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
               Изменить ресторан
            </h3>

            <div class="space-y-4 mb-6">
               <div class="text-left">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Город</label>
                  <select v-model="selectedCityId"
                          @change="onCityChange"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                     <option :value="null">Выберите город</option>
                     <option v-for="city in cities"
                             :key="city.id"
                             :value="city.id">{{ city.name }}</option>
                  </select>
               </div>
               <div class="text-left">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ресторан</label>
                  <select v-model="selectedRestaurantId"
                          :disabled="!selectedCityId"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50">
                     <option :value="null">Выберите ресторан</option>
                     <option v-for="restaurant in restaurants"
                             :key="restaurant.id"
                             :value="restaurant.id">{{ restaurant.name }}</option>
                  </select>
               </div>
            </div>
         </div>

         <div class="flex gap-3">
            <BaseButton variant="secondary"
                        class="flex-1"
                        @click="showRestaurantModal = false">
               Отмена
            </BaseButton>
            <BaseButton variant="primary"
                        class="flex-1"
                        :loading="isLoadingRestaurant"
                        :disabled="!selectedCityId || !selectedRestaurantId"
                        @click="updateRestaurant">
               Сохранить
            </BaseButton>
         </div>
      </BaseModal>
   </div>
</template>
