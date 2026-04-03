<script setup>
import { PAYMENT_STATUS_TYPE } from '~/constants/paymentStatusType'
import { ORDER_STATUS } from '~/constants/orderStatus'
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
const showDropdown = ref(false)
const showCancelModal = ref(false)

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

const nextStatus = async () => {
   isLoadingNext.value = true
   try {
      const response = await $api.patch(`/orders/${props.order.id}/next-status`)
      const newStatus = response.data.orderStatus || response.data.data?.orderStatus
      showToast('Статус изменён', 'success')
      if (newStatus) {
         props.order.orderStatus = newStatus
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
      const response = await $api.patch(`/orders/${props.order.id}/previous-status`)
      const newStatus = response.data.orderStatus || response.data.data?.orderStatus
      showToast('Статус изменён', 'success')
      if (newStatus) {
         props.order.orderStatus = newStatus
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
      await $api.patch(`/orders/${props.order.id}`, { orderStatus: 'отменен' })
      showToast('Заказ отменён', 'success')
      props.order.orderStatus = 'отменен'
      showCancelModal.value = false
   } catch (e) {
      showToast('Ошибка отмены заказа', 'error')
      console.error(e)
   } finally {
      isLoadingCancel.value = false
   }
}

const viewOrder = () => {
   emit('view', props.order)
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
</script>

<template>
   <div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
         <div class="flex gap-2 items-center justify-between mb-2 mx-1">
            <div>
               <span class="font-semibold">{{ order.number }}</span>
               <span class="text-gray-500 dark:text-gray-400 text-xs ml-1" title="внутренний номер заказа">#{{ order.id }}</span>
            </div>
            <div class="flex-1 text-center">
               <span class="text-gray-500 dark:text-gray-400 text-base" title="время создания заказа">{{ order.createdAt?.split(', ')[1]?.slice(0, 5) || '' }}</span>
            </div>
            <div v-if="order.city?.name" class="text-[11px] text-gray-500 dark:text-gray-400 text-right leading-tight">
               <div>{{ order.city.name }}</div>
               <div v-if="order.restaurant?.name" class="text-[10px]">{{ order.restaurant.name }}</div>
            </div>
         </div>
         
         <div class="text-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between gap-2 w-full">
               <span class="flex-1 inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400">
                  {{ order.orderTypeName }}
               </span>
               <span v-if="order.packTakeaway" class="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Упаковать
               </span>
                <span v-else class="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                   <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
                   </svg>
                   Сервировать
                </span>
            </div>
            <div v-if="order.orderStatus" :class="['px-3 py-1.5 rounded-lg text-sm font-semibold text-center block w-full mt-3', getStatusClass(order.orderStatus)]">
               {{ order.orderStatus }}
            </div>
</div>
          <div class="flex items-start justify-between gap-4 mb-3">
             <div>
                 <div v-if="order.user?.phone" class="text-xs text-blue-600 dark:text-blue-400 mt-0.5 flex items-center gap-1">
                    <svg class="w-3 h-3 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {{ formatPhone(order.user.phone) }}
                 </div>
<div v-if="formatAddress(order.userAddress)" class="text-xs text-green-600 dark:text-green-400 mt-0.5 flex items-center gap-1">
                     <svg class="w-3 h-3 text-green-500 dark:text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                     </svg>
                     <div>
                        {{ formatAddress(order.userAddress) }}
                        <span v-if="order.deliveryZone?.name" class="text-gray-500 dark:text-gray-400"> ({{ order.deliveryZone.name }})</span>
                     </div>
                  </div>
             </div>
<div class="flex flex-col items-end gap-1 whitespace-nowrap">
                 <span :class="getPaymentStatusClass(order.paymentStatus)" class="text-xs block">{{ order.paymentStatus }}</span>
                <span v-if="order.paymentType" class="text-xs text-gray-500 dark:text-gray-400">{{ order.paymentType }}</span>
                <span v-if="order.banknoteForChange" class="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded px-1.5 py-0.5 mt-1 block">Сдача с: {{ order.banknoteForChange }} ₽</span>
             </div>
          </div>

      <div v-if="order.tableNumber || order.carNumber || order.leaveAtTheDoor || order.dontRingDoorbell || order.userComment" class="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 mb-3 flex flex-wrap gap-2">
         <div v-if="order.tableNumber" class="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded px-2 py-1">
            Стол № {{ order.tableNumber }}
         </div>
         <div v-if="order.carNumber" class="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded px-2 py-1">
            {{ order.carNumber }}
         </div>
         <div v-if="order.leaveAtTheDoor" class="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded px-2 py-1">
            Оставить у двери
         </div>
         <div v-if="order.dontRingDoorbell" class="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded px-2 py-1">
            Не звонить в дверь
         </div>

<div v-if="order.userComment" class="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded px-2 py-1" title="Комментарий клиента">
            {{ order.userComment }}
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

      <div class="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
<span v-if="order.orderStatus === ORDER_STATUS.CREATED" :class="['px-3 py-1.5 rounded-lg text-sm font-semibold flex justify-center text-center w-full', getStatusClass(order.orderStatus)]">
                 {{ order.orderStatus }}
              </span>
             <span v-else :class="['px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center justify-center', getStatusClass(order.orderStatus)]">
                {{ order.orderStatus }}
            </span>

            <div class="mt-3 flex items-center gap-2 ">
          <button 
             @click="nextStatus" 
             :disabled="isLoadingNext"
             class="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
           >
              {{ isLoadingNext ? '...' : 'Следующий статус' }}
           </button>
           <button 
              @click="viewOrder"
              class="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors cursor-pointer"
           >
              Просмотр
           </button>
           <div class="relative dropdown-container">
               <button 
                  @click="toggleDropdown"
                  class="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors cursor-pointer"
               >
                 <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                 </svg>
              </button>
               <div v-if="showDropdown" class="absolute right-0 mb-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 bottom-full">
                  <button 
                     @click="prevStatus(); closeDropdown()"
                     :disabled="isLoadingPrev"
                     class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                  >
                     {{ isLoadingPrev ? '...' : 'Предыдущий статус' }}
                  </button>
                   <button 
                      @click="showCancelModal = true; closeDropdown()"
                      :disabled="isLoadingCancel"
                      class="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                   >
                      {{ isLoadingCancel ? '...' : 'Отменить заказ' }}
                  </button>
               </div>
           </div>
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
           Вы уверены, что хотите отменить заказ <strong>#{{ order.number }}</strong>?
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
   </div>
</template>
