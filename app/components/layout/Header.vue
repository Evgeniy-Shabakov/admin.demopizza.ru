<script setup>
const route = useRoute()
const router = useRouter()
const pageTitle = useState('pageTitle', () => 'Главная')
const headerActions = useState('headerActions', () => [])
const { activeOrdersCount } = useActiveOrders()

const titles = {
   '/': 'Главная',
   '/countries': 'Страны',
   '/countries/add': 'Добавить страну',
   '/countries/:id': 'Просмотр страны',
   '/countries/:id/edit': 'Редактирование страны',
   '/cities': 'Города',
   '/cities/add': 'Добавить город',
   '/cities/:id': 'Просмотр города',
   '/cities/:id/edit': 'Редактирование города',
   '/categories': 'Категории',
   '/categories/add': 'Добавить категорию',
   '/categories/:id': 'Просмотр категории',
   '/categories/:id/edit': 'Редактирование категории',
   '/products': 'Товары',
   '/products/add': 'Добавить товар',
   '/products/:id': 'Просмотр товара',
   '/products/:id/edit': 'Редактирование товара',
   '/active-orders': 'Активные заказы',
   '/active-orders/:id': 'Просмотр заказа',
   '/stop-list': 'Стоп-лист',
   '/stop-list/add': 'Добавить в стоп-лист',
   '/stop-list/:id': 'Просмотр записи',
   '/stop-list/:id/edit': 'Редактирование записи',
   '/restaurant-schedules': 'Графики работы',
   '/restaurant-schedules/add': 'Добавить график',
   '/restaurant-schedules/:id': 'Просмотр графика',
   '/restaurant-schedules/:id/edit': 'Редактирование графика',
   '/restaurants': 'Рестораны',
   '/restaurants/add': 'Добавить ресторан',
   '/restaurants/:id': 'Просмотр ресторана',
   '/restaurants/:id/edit': 'Редактирование ресторана',
   '/delivery-zones': 'Зоны доставки',
   '/delivery-zones/add': 'Добавить зону доставки',
   '/delivery-zones/:id': 'Просмотр зоны доставки',
   '/delivery-zones/:id/edit': 'Редактирование зоны доставки',
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
    } else if (path === '/cities/add') {
       pageTitle.value = titles['/cities/add']
       headerActions.value = [
          { label: 'Назад', icon: 'back', back: true }
       ]
    } else if (path.match(/^\/cities\/\d+$/)) {
       pageTitle.value = titles['/cities/:id']
       const id = route.params.id
       headerActions.value = [
          { label: 'Назад', icon: 'back', back: true },
          { to: `/cities/${id}/edit`, label: 'Редактировать', icon: 'edit' }
       ]
    } else if (path.match(/^\/cities\/\d+\/edit$/)) {
       pageTitle.value = titles['/cities/:id/edit']
       headerActions.value = [
          { label: 'Назад', icon: 'back', back: true }
       ]
      } else if (path.startsWith('/cities')) {
        pageTitle.value = titles['/cities']
        headerActions.value = [
           { to: '/cities/add', label: 'Добавить', icon: 'add', primary: true }
        ]
      } else if (path === '/categories/add') {
        pageTitle.value = titles['/categories/add']
        headerActions.value = [
           { label: 'Назад', icon: 'back', back: true }
        ]
      } else if (path.match(/^\/categories\/\d+$/)) {
        pageTitle.value = titles['/categories/:id']
        const id = route.params.id
        headerActions.value = [
           { label: 'Назад', icon: 'back', back: true },
           { to: `/categories/${id}/edit`, label: 'Редактировать', icon: 'edit' }
        ]
      } else if (path.match(/^\/categories\/\d+\/edit$/)) {
        pageTitle.value = titles['/categories/:id/edit']
        headerActions.value = [
           { label: 'Назад', icon: 'back', back: true }
        ]
      } else if (path.startsWith('/categories')) {
         pageTitle.value = titles['/categories']
         headerActions.value = [
            { to: '/categories/add', label: 'Добавить', icon: 'add', primary: true }
         ]
      } else if (path === '/products/add') {
         pageTitle.value = titles['/products/add']
         headerActions.value = [
            { label: 'Назад', icon: 'back', back: true }
         ]
      } else if (path.match(/^\/products\/\d+$/)) {
         pageTitle.value = titles['/products/:id']
         const id = route.params.id
         headerActions.value = [
            { label: 'Назад', icon: 'back', back: true },
            { to: `/products/${id}/edit`, label: 'Редактировать', icon: 'edit' }
         ]
      } else if (path.match(/^\/products\/\d+\/edit$/)) {
         pageTitle.value = titles['/products/:id/edit']
         headerActions.value = [
            { label: 'Назад', icon: 'back', back: true }
         ]
       } else if (path.startsWith('/products')) {
          pageTitle.value = titles['/products']
          headerActions.value = [
             { to: '/products/add', label: 'Добавить', icon: 'add', primary: true }
          ]
       } else if (path.startsWith('/active-orders')) {
          if (path.match(/^\/active-orders\/\d+$/)) {
             pageTitle.value = titles['/active-orders/:id']
             headerActions.value = [
                { label: 'Назад', icon: 'back', back: true }
             ]
          } else {
             pageTitle.value = titles['/active-orders']
             headerActions.value = []
          }
       } else if (path === '/stop-list/add') {
         pageTitle.value = titles['/stop-list/add']
         headerActions.value = [
            { label: 'Назад', icon: 'back', back: true }
         ]
      } else if (path.match(/^\/stop-list\/\d+$/)) {
         pageTitle.value = titles['/stop-list/:id']
         const id = route.params.id
         headerActions.value = [
            { label: 'Назад', icon: 'back', back: true },
            { to: `/stop-list/${id}/edit`, label: 'Редактировать', icon: 'edit' }
         ]
      } else if (path.match(/^\/stop-list\/\d+\/edit$/)) {
         pageTitle.value = titles['/stop-list/:id/edit']
         headerActions.value = [
            { label: 'Назад', icon: 'back', back: true }
         ]
      } else if (path.startsWith('/stop-list')) {
         pageTitle.value = titles['/stop-list']
         headerActions.value = [
            { to: '/stop-list/add', label: 'Добавить', icon: 'add', primary: true }
         ]
      } else if (path === '/restaurant-schedules/add') {
       pageTitle.value = titles['/restaurant-schedules/add']
       headerActions.value = [
          { label: 'Назад', icon: 'back', back: true }
       ]
     } else if (path.match(/^\/restaurant-schedules\/\d+$/)) {
       pageTitle.value = titles['/restaurant-schedules/:id']
       const id = route.params.id
       headerActions.value = [
          { label: 'Назад', icon: 'back', back: true },
          { to: `/restaurant-schedules/${id}/edit`, label: 'Редактировать', icon: 'edit' }
       ]
     } else if (path.match(/^\/restaurant-schedules\/\d+\/edit$/)) {
       pageTitle.value = titles['/restaurant-schedules/:id/edit']
       headerActions.value = [
          { label: 'Назад', icon: 'back', back: true }
       ]
      } else if (path.startsWith('/restaurant-schedules')) {
        pageTitle.value = titles['/restaurant-schedules']
        headerActions.value = [
           { to: '/restaurant-schedules/add', label: 'Добавить', icon: 'add', primary: true }
        ]
     } else if (path === '/restaurants/add') {
        pageTitle.value = titles['/restaurants/add']
        headerActions.value = [
           { label: 'Назад', icon: 'back', back: true }
        ]
     } else if (path.match(/^\/restaurants\/\d+$/)) {
        pageTitle.value = titles['/restaurants/:id']
        const id = route.params.id
        headerActions.value = [
           { label: 'Назад', icon: 'back', back: true },
           { to: `/restaurants/${id}/edit`, label: 'Редактировать', icon: 'edit' }
        ]
     } else if (path.match(/^\/restaurants\/\d+\/edit$/)) {
        pageTitle.value = titles['/restaurants/:id/edit']
        headerActions.value = [
           { label: 'Назад', icon: 'back', back: true }
        ]
     } else if (path.startsWith('/restaurants')) {
         pageTitle.value = titles['/restaurants']
         headerActions.value = [
            { to: '/restaurants/add', label: 'Добавить', icon: 'add', primary: true }
         ]
      } else if (path === '/delivery-zones/add') {
         pageTitle.value = titles['/delivery-zones/add']
         headerActions.value = [
            { label: 'Назад', icon: 'back', back: true }
         ]
      } else if (path.match(/^\/delivery-zones\/\d+$/)) {
         pageTitle.value = titles['/delivery-zones/:id']
         const id = route.params.id
         headerActions.value = [
            { label: 'Назад', icon: 'back', back: true },
            { to: `/delivery-zones/${id}/edit`, label: 'Редактировать', icon: 'edit' }
         ]
      } else if (path.match(/^\/delivery-zones\/\d+\/edit$/)) {
         pageTitle.value = titles['/delivery-zones/:id/edit']
         headerActions.value = [
            { label: 'Назад', icon: 'back', back: true }
         ]
      } else if (path.startsWith('/delivery-zones')) {
         pageTitle.value = titles['/delivery-zones']
         headerActions.value = [
            { to: '/delivery-zones/add', label: 'Добавить', icon: 'add', primary: true }
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

            <h1 class="text-lg font-semibold flex items-center gap-2">
               {{ pageTitle }}
               <BaseBadge v-if="route.path === '/active-orders' && activeOrdersCount > 0"
                          variant="danger"
                          size="md">
                  {{ activeOrdersCount }}
               </BaseBadge>
            </h1>
            
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
                          class="px-4 py-2 md:px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                  <svg class="w-4 h-4"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span class="hidden md:inline">{{ action.label }}</span>
               </NuxtLink>
            </template>
         </div>
      </div>
   </header>
</template>
