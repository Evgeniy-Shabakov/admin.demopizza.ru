<script setup>
useHead({
   title: 'Активные заказы'
})

const { orders, loading, fetchActiveOrders } = useOrders()

onMounted(() => {
   fetchActiveOrders()
   setInterval(fetchActiveOrders, 30000)
})
</script>

<template>
   <div>
      <div v-if="loading && !orders.length" class="flex items-center justify-center py-12">
         <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
      
      <div v-else-if="!orders.length" class="text-center py-12 text-gray-500 dark:text-gray-400">
         Активные заказы не найдены
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         <OrdersActiveOrderCard 
            v-for="order in orders" 
            :key="order.id" 
            :order="order" 
         />
      </div>
   </div>
</template>