<script setup>
const { initTheme } = useTheme()
const route = useRoute()
const isSidebarOpen = ref(false)

const menuItems = [
  { name: 'Главная', path: '/', icon: 'home' },
  { name: 'Страны', path: '/countries', icon: 'globe' },
  { name: 'Города', path: '/cities', icon: 'city' },
  { name: 'Графики работы', path: '/restaurant-schedules', icon: 'clock' },
]

onMounted(() => {
  initTheme()
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
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
      @toggle="toggleSidebar"
      @close="closeSidebar"
    />
    
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="closeSidebar"
    ></div>
    
    <div class="lg:pl-64 min-h-screen flex flex-col">
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
