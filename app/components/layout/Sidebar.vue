<script setup>
defineProps({
   menuItems: Array,
   isOpen: Boolean,
   isCollapsed: Boolean
})

const emit = defineEmits(['toggle', 'close', 'toggle-collapse'])

const route = useRoute()
const { logout } = useAuth()

const handleMenuClick = () => {
   emit('close')
}
</script>

<template>
<aside :class="[
   'w-72 fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transition-all duration-300 lg:translate-x-0',
   isOpen ? 'translate-x-0' : '-translate-x-full',
   isCollapsed ? 'lg:w-20' : ''
]">

       <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
           <div :class="isCollapsed ? 'lg:hidden' : ''">
             <UiEmployeeData/>
           </div>
           <button @click="emit('toggle-collapse')"
                   class="hidden lg:flex p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
             <svg class="w-5 h-5 transition-transform" :class="isCollapsed ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
             </svg>
           </button>
           <button @click="emit('close')"
                   class="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
       </div>

      <nav class="p-4 space-y-2">
          <NuxtLink v-for="item in menuItems"
                    :key="item.path"
                    :to="item.path"
                    @click="handleMenuClick"
                    :class="[
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer',
                      route.path === item.path || (item.path !== '/admin' && route.path.startsWith(item.path + '/'))
                         ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                         : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
                      isCollapsed ? 'lg:justify-center lg:px-2' : ''
                    ]">
             <svg v-if="item.icon === 'home'"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
             </svg>
             <svg v-else-if="item.icon === 'users'"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
             </svg>
             <svg v-else-if="item.icon === 'globe'"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
              <svg v-else-if="item.icon === 'city'"
                   class="w-5 h-5"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24">
                 <path stroke-linecap="round"
                       stroke-linejoin="round"
                       stroke-width="2"
                       d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <svg v-else-if="item.icon === 'clock'"
                   class="w-5 h-5"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24">
                 <path stroke-linecap="round"
                       stroke-linejoin="round"
                       stroke-width="2"
                       d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else-if="item.icon === 'settings'"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
              <span :class="isCollapsed ? 'lg:hidden' : ''">{{ item.name }}</span>
           </NuxtLink>
        </nav>

        <div :class="isCollapsed ? 'lg:hidden' : ''" class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button @click="logout"
                  class="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer">
            <svg class="w-5 h-5"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выход
          </button>
          <UiToggleTheme />
        </div>
        <div :class="isCollapsed ? 'lg:flex' : 'lg:hidden'" class="hidden absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 justify-center">
          <UiToggleTheme />
        </div>
    </aside>
</template>
