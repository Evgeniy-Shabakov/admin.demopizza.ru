<script setup>
import { PAYMENT_STATUS_TYPE } from '~/constants/paymentStatusType'
import { ORDER_STATUS } from '~/constants/orderStatus'
import { PAYMENT_TYPE } from '~/constants/paymentType'
import { useToast } from '~/composables/useToast'
import BaseModal from '~/components/base/BaseModal.vue'
import BaseButton from '~/components/base/BaseButton.vue'

useHead({
   title: 'Заказ'
})

const route = useRoute()
const { $api } = useNuxtApp()
const { showToast } = useToast()

const order = ref(null)
const loading = ref(true)
const error = ref(null)

const isLoadingNext = ref(false)
const isLoadingPrev = ref(false)
const isLoadingCancel = ref(false)
const isLoadingPayment = ref(false)
const showCancelModal = ref(false)
const showPaymentModal = ref(false)
const showRestaurantModal = ref(false)
const isLoadingRestaurant = ref(false)
const cities = ref([])
const restaurants = ref([])
const selectedCityId = ref(null)
const selectedRestaurantId = ref(null)

const canChangePayment = computed(() => {
   return order.value?.paymentType === PAYMENT_TYPE.CASH || order.value?.paymentType === PAYMENT_TYPE.CARD_OFFLINE
})

const totalItemsCount = computed(() => {
   if (!order.value?.orderProducts) return 0
   return order.value.orderProducts.reduce((sum, item) => sum + item.quantity, 0)
})

const positionsCount = computed(() => {
   return order.value?.orderProducts?.length || 0
})

const fetchOrder = async () => {
   loading.value = true
   error.value = null
   try {
      const response = await $api.get(`/orders/${route.params.id}`)
      order.value = response.data?.data || response.data
   } catch (e) {
      error.value = e
      console.error(e)
   } finally {
      loading.value = false
   }
}

const nextStatus = async () => {
   isLoadingNext.value = true
   try {
      const response = await $api.patch(`/orders/${order.value.id}/next-status`)
      const newStatus = response.data.orderStatus || response.data.data?.orderStatus
      showToast('Статус изменён', 'success')
      if (newStatus) {
         order.value.orderStatus = newStatus
      }
   } catch (e) {
      showToast('Ошибка изменения статуса', 'error')
      console.error(e)
   } finally {
      isLoadingNext.value = false
   }
}

const prevStatus = async () => {
   isLoadingPrev.value = true
   try {
      const response = await $api.patch(`/orders/${order.value.id}/previous-status`)
      const newStatus = response.data.orderStatus || response.data.data?.orderStatus
      showToast('Статус изменён', 'success')
      if (newStatus) {
         order.value.orderStatus = newStatus
      }
   } catch (e) {
      showToast('Ошибка изменения статуса', 'error')
      console.error(e)
   } finally {
      isLoadingPrev.value = false
   }
}

const cancelOrder = async () => {
   isLoadingCancel.value = true
   try {
      await $api.patch(`/orders/${order.value.id}`, { orderStatus: 'отменен' })
      showToast('Заказ отменён', 'success')
      order.value.orderStatus = 'отменен'
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
      const newStatus = order.value.paymentStatus === PAYMENT_STATUS_TYPE.NO_PAID 
         ? PAYMENT_STATUS_TYPE.PAID 
         : PAYMENT_STATUS_TYPE.NO_PAID
      await $api.patch(`/orders/${order.value.id}`, { paymentStatus: newStatus })
      showToast('Статус оплаты изменён', 'success')
      order.value.paymentStatus = newStatus
      showPaymentModal.value = false
   } catch (e) {
      showToast('Ошибка изменения статуса оплаты', 'error')
      console.error(e)
   } finally {
      isLoadingPayment.value = false
   }
}

const openRestaurantModal = async () => {
   selectedCityId.value = order.value.city?.id || null
   selectedRestaurantId.value = order.value.restaurant?.id || null
   
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
      await $api.patch(`/orders/${order.value.id}`, {
         cityId: selectedCityId.value,
         restaurantId: selectedRestaurantId.value
      })
      
      const city = cities.value.find(c => c.id === selectedCityId.value)
      const restaurant = restaurants.value.find(r => r.id === selectedRestaurantId.value)
      
      order.value.city = city || order.value.city
      order.value.restaurant = restaurant || order.value.restaurant
      
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

const getPaymentTypeInfo = (type) => {
   const types = {
      [PAYMENT_TYPE.CASH]: {
         class: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
         icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
      },
      [PAYMENT_TYPE.CARD_OFFLINE]: {
         class: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
         icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
      },
      [PAYMENT_TYPE.ONLINE]: {
         class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
         icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
      }
   }
   return types[type] || { class: 'text-gray-500 dark:text-gray-400', icon: '' }
}

const formatPhone = (phone) => {
   if (!phone) return ''
   const cleaned = phone.replace(/\D/g, '')
   if (cleaned.length === 11) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
   }
   return phone
}

const formatAddress = (address) => {
   if (!address) return ''
   const parts = []
   if (address.street) parts.push(address.street)
   if (address.house) parts.push(`д. ${address.house}`)
   if (address.corps) parts.push(`корп. ${address.corps}`)
   if (address.flat) parts.push(`кв. ${address.flat}`)
   if (address.entrance) parts.push(`под. ${address.entrance}`)
   if (address.floor) parts.push(`эт. ${address.floor}`)
   if (address.entranceCode) parts.push(`код ${address.entranceCode}`)
   if (address.comment) parts.push(address.comment)
   return parts.join(', ')
}

const getProductImageUrl = (product) => {
   if (!product?.imagePath) return null
   const config = useRuntimeConfig()
   const apiBaseUrl = config.public.apiBaseUrl.replace('/api/v1', '')
   return product.imagePath.replace('storage/public', apiBaseUrl)
}

onMounted(() => {
   fetchOrder()
})
</script>

<template>
   <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
   </div>

   <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 dark:text-red-400 mb-4">Ошибка загрузки заказа</div>
      <NuxtLink to="/active-orders" class="text-indigo-600 dark:text-indigo-400 hover:underline">
         Вернуться к заказам
      </NuxtLink>
   </div>

   <div v-else-if="order" class="space-y-6 max-w-4xl">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
         <div class="flex gap-2 items-center justify-between mb-6 mx-1">
            <div>
               <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ order.number }}</span>
               <span class="text-gray-500 dark:text-gray-400 text-lg ml-2" title="внутренний номер заказа">#{{ order.id }}</span>
            </div>
            <div class="flex-1 text-center">
               <span class="text-gray-500 dark:text-gray-400 text-xl" title="время создания заказа">{{ order.createdAt?.split(', ')[1]?.slice(0, 5) || '' }}</span>
            </div>
            <div v-if="order.city?.name" class="text-base text-gray-500 dark:text-gray-400 text-right">
               <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ order.city.name }}</div>
               <div v-if="order.restaurant?.name" class="text-base">{{ order.restaurant.name }}</div>
            </div>
         </div>
         
         <div class="text-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between gap-4 w-full mb-3">
               <span class="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg text-base font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400">
                  {{ order.orderTypeName }}
               </span>
               <span v-if="order.packTakeaway" class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-base font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Упаковать
               </span>
               <span v-else class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-base font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
                  </svg>
                  Сервировать
               </span>
            </div>
            <div v-if="order.orderStatus" :class="['px-4 py-2 rounded-lg text-base font-semibold text-center block w-full', getStatusClass(order.orderStatus)]">
               {{ order.orderStatus }}
            </div>
         </div>

         <div class="flex items-start justify-between gap-6 mb-6">
            <div class="flex-1">
               <div v-if="order.user?.phone" class="text-base text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ formatPhone(order.user.phone) }}
               </div>
               <div v-if="order.userAddress && formatAddress(order.userAddress)" class="text-base text-green-600 dark:text-green-400 flex items-start gap-2">
                  <svg class="w-5 h-5 text-green-500 dark:text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                     {{ formatAddress(order.userAddress) }}
                  </div>
               </div>
               <div v-if="order.deliveryZone?.name" class="text-base text-gray-500 dark:text-gray-400 mt-1 ml-7">
                  Зона доставки: {{ order.deliveryZone.name }}
               </div>
               <div v-else-if="order.address" class="text-base text-green-600 dark:text-green-400 flex items-start gap-2">
                  <svg class="w-5 h-5 text-green-500 dark:text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                     {{ order.address }}
                  </div>
               </div>
            </div>
            <div class="flex flex-col items-end gap-2">
               <button 
                  :disabled="!canChangePayment || isLoadingPayment"
                  @click="showPaymentModal = true"
                  :title="!canChangePayment ? 'Изменить статус оплаты вручную можно только при оплате наличными или картой офлайн' : null"
                  :class="[
                     'text-sm block rounded px-3 py-1.5 transition-colors font-medium',
                     order.paymentStatus === PAYMENT_STATUS_TYPE.PAID 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700',
                     canChangePayment ? 'cursor-pointer' : 'cursor-not-allowed'
                  ]"
               >
                  {{ order.paymentStatus }}
               </button>
               <span v-if="order.paymentType" :class="getPaymentTypeInfo(order.paymentType).class" class="text-sm flex items-center gap-1.5">
                  <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getPaymentTypeInfo(order.paymentType).icon" />
                  </svg>
                  {{ order.paymentType }}
               </span>
               <span v-if="order.banknoteForChange" class="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded px-2 py-1">Сдача с: {{ order.banknoteForChange }} ₽</span>
            </div>
         </div>

         <div v-if="order.tableNumber || order.carNumber || order.leaveAtTheDoor || order.dontRingDoorbell || order.userComment" class="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6 flex flex-wrap gap-3">
            <div v-if="order.tableNumber" class="text-base bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg px-3 py-1.5">
               Стол № {{ order.tableNumber }}
            </div>
            <div v-if="order.carNumber" class="text-base bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg px-3 py-1.5">
               {{ order.carNumber }}
            </div>
            <div v-if="order.leaveAtTheDoor" class="text-base bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg px-3 py-1.5">
               Оставить у двери
            </div>
            <div v-if="order.dontRingDoorbell" class="text-base bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg px-3 py-1.5">
               Не звонить в дверь
            </div>
            <div v-if="order.userComment" class="text-base bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg px-3 py-1.5" title="Комментарий клиента">
               {{ order.userComment }}
            </div>
         </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
         <div class="text-base text-gray-500 dark:text-gray-400 mb-4">
            Позиций: <span class="text-gray-900 dark:text-white font-medium">{{ positionsCount }}</span> | Товаров: <span class="text-gray-900 dark:text-white font-medium">{{ totalItemsCount }}</span>
         </div>

         <div class="space-y-4">
            <div v-for="item in order.orderProducts" :key="item.productId" class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
               <img v-if="getProductImageUrl(item.product)" :src="getProductImageUrl(item.product)" :alt="item.product.name" class="w-14 h-14 rounded-lg object-cover">
               <div v-else class="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
               </div>
               <div class="flex-1">
                  <span class="text-lg font-medium text-gray-900 dark:text-white">{{ item.product?.name }}</span>
               </div>
               <div class="text-right">
                  <span class="text-xl font-semibold text-gray-900 dark:text-white">{{ item.quantity }} шт.</span>
                  <div class="text-sm text-gray-500 dark:text-gray-400">({{ item.quantity }} × {{ item.price }}) {{ item.price * item.quantity }} ₽</div>
               </div>
            </div>
         </div>

         <div v-if="order.totalProductsPrice !== undefined || order.totalPrice !== undefined" class="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 space-y-2">
            <div v-if="order.totalProductsPrice !== undefined" class="flex justify-between text-base">
               <span class="text-gray-500 dark:text-gray-400">Товары</span>
               <span class="text-gray-900 dark:text-gray-100">{{ order.totalProductsPrice }} ₽</span>
            </div>
            <div v-if="order.deliveryPrice !== undefined && order.deliveryPrice > 0" class="flex justify-between text-base">
               <span class="text-gray-500 dark:text-gray-400">Доставка</span>
               <span class="text-gray-900 dark:text-gray-100">{{ order.deliveryPrice }} ₽</span>
            </div>
            <div v-if="order.bonusCoinsPaid !== undefined && order.bonusCoinsPaid > 0" class="flex justify-between text-base">
               <span class="text-gray-500 dark:text-gray-400">Оплачено бонусами</span>
               <span class="text-amber-600 dark:text-amber-400">-{{ order.bonusCoinsPaid }}</span>
            </div>
            <div v-if="order.totalPrice !== undefined" class="flex justify-between text-xl font-semibold pt-2">
               <span class="text-gray-900 dark:text-gray-100">Итого</span>
               <span class="text-gray-900 dark:text-gray-100">{{ order.totalPrice }} ₽</span>
            </div>
            <div v-if="order.bonusCoinsEarned !== undefined && order.bonusCoinsEarned > 0" class="flex justify-between text-base">
               <span class="text-gray-500 dark:text-gray-400">Будет начислено бонусов</span>
               <span class="text-green-600 dark:text-green-400">+{{ order.bonusCoinsEarned }}</span>
            </div>
         </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
         <div :class="['px-4 py-2 rounded-lg text-base font-semibold text-center block w-full mb-4', getStatusClass(order.orderStatus)]">
            {{ order.orderStatus }}
         </div>

         <div class="flex items-center gap-3">
            <button 
               @click="nextStatus" 
               :disabled="isLoadingNext"
               class="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-base font-medium rounded-lg transition-colors cursor-pointer"
            >
               {{ isLoadingNext ? '...' : 'Следующий статус' }}
            </button>
            <button 
               @click="prevStatus" 
               :disabled="isLoadingPrev"
               class="px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-base font-medium rounded-lg transition-colors cursor-pointer"
            >
               {{ isLoadingPrev ? '...' : 'Предыдущий статус' }}
            </button>
            <button 
               @click="showCancelModal = true"
               :disabled="isLoadingCancel"
               class="px-4 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-base font-medium rounded-lg transition-colors cursor-pointer"
            >
               {{ isLoadingCancel ? '...' : 'Отменить' }}
            </button>
            <button 
               @click="openRestaurantModal"
               class="px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-base font-medium rounded-lg transition-colors cursor-pointer"
            >
               Изменить ресторан
            </button>
         </div>
      </div>
   </div>

   <BaseModal :show="showCancelModal" @close="showCancelModal = false">
      <div class="text-center">
         <div class="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30">
            <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
         </div>

         <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Отменить заказ
         </h3>

         <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
            Вы уверены, что хотите отменить заказ <strong>#{{ order?.number }}</strong>?
         </p>
      </div>

      <div class="flex gap-3">
         <BaseButton variant="secondary" class="flex-1" @click="showCancelModal = false">
            Отмена
         </BaseButton>
         <BaseButton variant="danger" class="flex-1" :loading="isLoadingCancel" @click="cancelOrder">
            Отменить
         </BaseButton>
      </div>
   </BaseModal>

   <BaseModal :show="showPaymentModal" @close="showPaymentModal = false">
      <div class="text-center">
         <div class="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" :class="order?.paymentStatus === PAYMENT_STATUS_TYPE.PAID ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'">
            <svg v-if="order?.paymentStatus === PAYMENT_STATUS_TYPE.PAID" class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg v-else class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
         </div>

         <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ order?.paymentStatus === PAYMENT_STATUS_TYPE.PAID ? 'Отменить оплату' : 'Подтвердить оплату' }}
         </h3>

         <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
            Вы уверены, что хотите {{ order?.paymentStatus === PAYMENT_STATUS_TYPE.PAID ? 'отменить' : 'подтвердить' }} оплату заказа <strong>#{{ order?.number }}</strong>?
         </p>
      </div>

      <div class="flex gap-3">
         <BaseButton variant="secondary" class="flex-1" @click="showPaymentModal = false">
            Отмена
         </BaseButton>
         <BaseButton :variant="order?.paymentStatus === PAYMENT_STATUS_TYPE.PAID ? 'danger' : 'success'" class="flex-1" :loading="isLoadingPayment" @click="updatePaymentStatus">
            {{ order?.paymentStatus === PAYMENT_STATUS_TYPE.PAID ? 'Отменить' : 'Подтвердить' }}
         </BaseButton>
      </div>
   </BaseModal>

   <BaseModal :show="showRestaurantModal" @close="showRestaurantModal = false">
      <div class="text-center">
         <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Изменить ресторан
         </h3>

         <div class="space-y-4 mb-6">
            <div class="text-left">
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Город</label>
               <select 
                  v-model="selectedCityId" 
                  @change="onCityChange"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
               >
                  <option :value="null">Выберите город</option>
                  <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }}</option>
               </select>
            </div>
            <div class="text-left">
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ресторан</label>
               <select 
                  v-model="selectedRestaurantId"
                  :disabled="!selectedCityId"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
               >
                  <option :value="null">Выберите ресторан</option>
                  <option v-for="restaurant in restaurants" :key="restaurant.id" :value="restaurant.id">{{ restaurant.name }}</option>
               </select>
            </div>
         </div>
      </div>

      <div class="flex gap-3">
         <BaseButton variant="secondary" class="flex-1" @click="showRestaurantModal = false">
            Отмена
         </BaseButton>
         <BaseButton variant="primary" class="flex-1" :loading="isLoadingRestaurant" :disabled="!selectedCityId || !selectedRestaurantId" @click="updateRestaurant">
            Сохранить
         </BaseButton>
      </div>
   </BaseModal>
</template>
