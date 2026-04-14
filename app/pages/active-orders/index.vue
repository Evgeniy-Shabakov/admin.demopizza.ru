<script setup>
useHead({
   title: 'Активные заказы'
})
const { orders, loading, fetchActiveOrders } = useOrders()
const { currentCityId, currentRestaurantId } = useGlobalCityRestaurant()
const router = useRouter()

fetchActiveOrders(currentCityId.value, currentRestaurantId.value)

const handleView = (order) => {
   router.push(`/active-orders/${order.id}`)
}
</script>

<template>
   <div>
      <div v-if="loading && !orders.length" class="flex items-center justify-center py-12">
         <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
      
      <div v-else-if="!orders.length" class="text-center py-12 text-gray-500 dark:text-gray-400">
         Активные заказы не найдены
      </div>

      <TransitionGroup 
         v-else 
         name="order-list" 
         tag="div" 
         class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
         <OrdersActiveOrderCard 
            v-for="order in orders" 
            :key="order.id" 
            :order="order" 
            @view="handleView"
         />
      </TransitionGroup>
   </div>
</template>

<style scoped>
.order-list-enter-active,
.order-list-leave-active {
   transition: all 1s ease;
}
.order-list-enter-from {
   opacity: 0;
   transform: translateY(-20px);
}
.order-list-leave-to {
   opacity: 0;
   transform: scale(0.8) translateX(-20px);
}
.order-list-leave-active {
   position: absolute;
}
.order-list-move {
   transition: transform 1s ease;
}
</style>