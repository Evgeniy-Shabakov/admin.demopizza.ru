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

      <div :class="isCollapsed ? 'lg:justify-center lg:px-0' : 'justify-between lg:px-4'"
           class="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
         <div :class="isCollapsed ? 'lg:hidden' : ''">
            <UiEmployeeData />
         </div>
         <button @click="emit('toggle-collapse')"
                 :class="isCollapsed ? 'lg:w-full lg:justify-center' : ''"
                 class="hidden lg:flex p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg class="w-5 h-5 transition-transform"
                 :class="isCollapsed ? 'rotate-180' : ''"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24">
               <path stroke-linecap="round"
                     stroke-linejoin="round"
                     stroke-width="2"
                     d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
         </button>
         <button @click="emit('close')"
                 class="ml-auto lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg class="w-6 h-6"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24">
               <path stroke-linecap="round"
                     stroke-linejoin="round"
                     stroke-width="2"
                     d="M6 18L18 6M6 6l12 12" />
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
                     isCollapsed ? 'lg:relative' : '',
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
            <svg v-else-if="item.icon === 'restaurant'"
                 class="w-5 h-5"
                 viewBox="0 0 24 24"
                 fill="currentColor">
               <path
                     d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
            </svg>
            <svg v-else-if="item.icon === 'map'"
                 class="w-5 h-5"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24">
               <path stroke-linecap="round"
                     stroke-linejoin="round"
                     stroke-width="2"
                     d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <svg v-else-if="item.icon === 'tag'"
                 class="w-5 h-5"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24">
               <path stroke-linecap="round"
                     stroke-linejoin="round"
                     stroke-width="2"
                     d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <svg v-else-if="item.icon === 'box'"
                 class="w-5 h-5"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24">
               <path stroke-linecap="round"
                     stroke-linejoin="round"
                     stroke-width="2"
                     d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <svg v-else-if="item.icon === 'ban'"
                 class="w-5 h-5"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24">
               <path stroke-linecap="round"
                     stroke-linejoin="round"
                     stroke-width="2"
                     d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
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
            <span v-if="item.badge && item.badge > 0"
                  :class="isCollapsed
                     ? 'lg:absolute lg:right-0 lg:bottom-0 lg:translate-x-1 lg:translate-y-1'
                     : 'ml-auto'">
               <BaseBadge :variant="isCollapsed ? 'danger' : 'danger'"
                          :size="isCollapsed ? 'xs' : 'md'">
                  {{ item.badge }}
               </BaseBadge>
            </span>
         </NuxtLink>
      </nav>

      <div
           class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
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
            <span :class="isCollapsed ? 'lg:hidden' : ''">Выход</span>
         </button>
         <UiToggleTheme :class="isCollapsed ? 'lg:hidden' : ''" />
      </div>
   </aside>
</template>
