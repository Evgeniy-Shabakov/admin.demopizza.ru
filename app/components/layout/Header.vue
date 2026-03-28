<script setup>
const route = useRoute()
const router = useRouter()
const pageTitle = useState('pageTitle', () => 'Главная')
const headerActions = useState('headerActions', () => [])

const titles = {
   '/': 'Главная',
   '/countries': 'Страны',
   '/countries/add': 'Добавить страну',
   '/countries/:id': 'Просмотр страны',
   '/countries/:id/edit': 'Редактирование страны',
}

watch(() => route.path, (path) => {
   if (path === '/') {
      pageTitle.value = titles['/']
      headerActions.value = []
    } else if (path === '/countries/add') {
       pageTitle.value = titles['/countries/add']
       headerActions.value = [
          { label: 'Назад', icon: 'back', back: true }
       ]
    } else if (path.match(/^\/countries\/\d+$/)) {
       pageTitle.value = titles['/countries/:id']
       const id = route.params.id
       headerActions.value = [
          { label: 'Назад', icon: 'back', back: true },
          { to: `/countries/${id}/edit`, label: 'Редактировать', icon: 'edit' }
       ]
    } else if (path.match(/^\/countries\/\d+\/edit$/)) {
       pageTitle.value = titles['/countries/:id/edit']
       headerActions.value = [
          { label: 'Назад', icon: 'back', back: true }
       ]
   } else if (path.startsWith('/countries')) {
      pageTitle.value = titles['/countries']
      headerActions.value = [
         { to: '/countries/add', label: 'Добавить', icon: 'add', primary: true }
      ]
   } else {
      pageTitle.value = titles['/']
      headerActions.value = []
   }
}, { immediate: true })

defineEmits(['toggleSidebar'])
</script>

<template>
   <header class="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between h-16 px-4 lg:px-6">
         <div class="flex items-center gap-4">
            <button @click="$emit('toggleSidebar')"
                    class="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
               <svg class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                  <path stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16" />
               </svg>
            </button>
            <button v-if="headerActions.length && headerActions[0].icon === 'back' && headerActions[0].back"
                      @click="router.back()"
                      class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
               <svg class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                 <path stroke-linecap="round"
                       stroke-linejoin="round"
                       stroke-width="2"
                       d="M15 19l-7-7 7-7" />
               </svg>
            </button>
            <NuxtLink v-else-if="headerActions.length && headerActions[0].icon === 'back'"
                      :to="headerActions[0].to"
                      class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
               <svg class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                 <path stroke-linecap="round"
                       stroke-linejoin="round"
                       stroke-width="2"
                       d="M15 19l-7-7 7-7" />
               </svg>
            </NuxtLink>

            <h1 class="text-lg font-semibold">{{ pageTitle }}</h1>
            
         </div>

         <div class="flex items-center gap-2">
            <template v-for="action in headerActions"
                      :key="action.label">
               <NuxtLink v-if="action.icon === 'add'"
                         :to="action.to"
                         :class="[
                           'px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer',
                           action.primary
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                         ]">
                   {{ action.label }}
                </NuxtLink>
                <NuxtLink v-else-if="action.icon === 'edit'"
                          :to="action.to"
                          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                  <svg class="w-4 h-4"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24">
                     <path stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke-width="2"
                           d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {{ action.label }}
               </NuxtLink>
            </template>
         </div>
      </div>
   </header>
</template>
