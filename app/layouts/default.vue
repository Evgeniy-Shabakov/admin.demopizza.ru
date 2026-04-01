<script setup>
const { initTheme } = useTheme()
const route = useRoute()
const isSidebarOpen = ref(false)
const isSidebarCollapsed = ref(false)

const menuItems = [
  { name: 'Главная', path: '/', icon: 'home' },
  { name: 'Страны', path: '/countries', icon: 'globe' },
  { name: 'Города', path: '/cities', icon: 'city' },
  { name: 'Графики работы', path: '/restaurant-schedules', icon: 'clock' },
  { name: 'Рестораны', path: '/restaurants', icon: 'restaurant' },
  { name: 'Зоны доставки', path: '/delivery-zones', icon: 'map' },
  { name: 'Категории', path: '/categories', icon: 'tag' },
  { name: 'Товары', path: '/products', icon: 'box' },
  { name: 'Стоп-лист', path: '/stop-list', icon: 'ban' },
]

onMounted(() => {
  initTheme()
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleSidebarCollapse = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <LayoutSidebar 
      :menu-items="menuItems" 
      :is-open="isSidebarOpen"
      :is-collapsed="isSidebarCollapsed"
      @toggle="toggleSidebar"
      @close="closeSidebar"
      @toggle-collapse="toggleSidebarCollapse"
    />
    
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="closeSidebar"
    ></div>
    
    <div :class="isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'" class="min-h-screen flex flex-col transition-all duration-300">
      <LayoutHeader 
        @toggle-sidebar="toggleSidebar"
      />
      
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>

    <UiToastContainer />
  </div>
</template>
