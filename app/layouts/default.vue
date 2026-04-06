<script setup>
const { initTheme } = useTheme()
const { isCollapsed, initSidebar, toggleCollapse } = useSidebar()
const route = useRoute()
const isSidebarOpen = ref(false)

const menuItems = ref([
   { name: 'Главная', path: '/', icon: 'home' },
   { name: 'Страны', path: '/countries', icon: 'globe' },
   { name: 'Города', path: '/cities', icon: 'city' },
   { name: 'Графики работы', path: '/restaurant-schedules', icon: 'clock' },
   { name: 'Рестораны', path: '/restaurants', icon: 'restaurant' },
   { name: 'Зоны доставки', path: '/delivery-zones', icon: 'map' },
   { name: 'Категории', path: '/categories', icon: 'tag' },
   { name: 'Товары', path: '/products', icon: 'box' },
   { name: 'Правовые документы', path: '/legal-documents', icon: 'document' },
   { name: 'Дизайн', path: '/designs', icon: 'palette' },
   { name: 'Активные заказы', path: '/active-orders', icon: 'shopping-cart', badge: 0 },
   { name: 'Все заказы', path: '/orders', icon: 'clipboard-list' },
   { name: 'Стоп-лист', path: '/stop-list', icon: 'ban', badge: 0 },
])

const { stopListCount, fetchStopListCount } = useStopList()
const { orders, activeOrdersCount, fetchActiveOrders } = useOrders()
const { success: showToast } = useToast()

const previousOrderIds = ref(new Set())
const isInitialLoad = ref(true)
const isTabActive = ref(true)
let ordersInterval = null
let stopListInterval = null
let orderCallCount = 0

const handleVisibilityChange = () => {
   isTabActive.value = !document.hidden
}

onMounted(async () => {
   initTheme()
   initSidebar()
   document.addEventListener('visibilitychange', handleVisibilityChange)
   await Promise.all([fetchStopListCount(), fetchActiveOrders()])
   
   previousOrderIds.value = new Set(orders.value.map(o => o.id))
   isInitialLoad.value = false
   
   ordersInterval = setInterval(() => {
      if (isTabActive.value) {
         fetchActiveOrders()
       } else {
          orderCallCount++
          if (orderCallCount >= 10) {
             fetchActiveOrders()
             orderCallCount = 0
          }
       }
   }, 30000)

   stopListInterval = setInterval(() => {
      if (isTabActive.value) fetchStopListCount()
   }, 180000)
})

onUnmounted(() => {
   document.removeEventListener('visibilitychange', handleVisibilityChange)
   if (ordersInterval) clearInterval(ordersInterval)
   if (stopListInterval) clearInterval(stopListInterval)
})

watch(stopListCount, (newVal) => {
   const item = menuItems.value.find(m => m.path === '/stop-list')
   if (item) item.badge = newVal
}, { immediate: true })

watch(activeOrdersCount, (newVal) => {
   const item = menuItems.value.find(m => m.path === '/active-orders')
   if (item) item.badge = newVal
}, { immediate: true })

watch(orders, (newOrders) => {
   if (isInitialLoad.value) return
   
   const newOrderIds = new Set(newOrders.map(o => o.id))
   const hasNewOrder = [...newOrderIds].some(id => !previousOrderIds.value.has(id))
   
   if (hasNewOrder) {
      showToast('NEW Новый заказ!')
   }
   
   previousOrderIds.value = newOrderIds
}, { deep: true })

const toggleSidebar = () => {
   isSidebarOpen.value = !isSidebarOpen.value
}

const toggleSidebarCollapse = () => {
   toggleCollapse()
}

const closeSidebar = () => {
   isSidebarOpen.value = false
}
</script>

<template>
   <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <LayoutSidebar :menu-items="menuItems"
                     :is-open="isSidebarOpen"
                     :is-collapsed="isCollapsed"
                     @toggle="toggleSidebar"
                     @close="closeSidebar"
                     @toggle-collapse="toggleSidebarCollapse" />

      <div v-if="isSidebarOpen"
           class="fixed inset-0 z-30 bg-black/50 lg:hidden"
           @click="closeSidebar"></div>

      <div :class="isCollapsed ? 'lg:pl-20' : 'lg:pl-72'"
           class="min-h-screen flex flex-col transition-all duration-300">
         <LayoutHeader @toggle-sidebar="toggleSidebar" />

         <main class="flex-1 p-6">
            <slot />
         </main>
      </div>

      <UiToastContainer />
   </div>
</template>
