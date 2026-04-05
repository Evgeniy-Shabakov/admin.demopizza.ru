<script setup>
const props = defineProps({
   pagination: {
      type: Object,
      required: true
   },
   perPageOptions: {
      type: Array,
      default: () => [15, 30, 50, 100]
   }
})

const emit = defineEmits(['page-change', 'per-page-change'])

const showPagination = computed(() => {
   return props.pagination.total > 0
})

const visiblePages = computed(() => {
   const total = props.pagination.lastPage
   const current = props.pagination.currentPage
   const pages = []
   
   if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i)
   } else {
      pages.push(1)
      
      if (current > 3) {
         pages.push('...')
      }
      
      const start = Math.max(2, current - 1)
      const end = Math.min(total - 1, current + 1)
      
      for (let i = start; i <= end; i++) {
         pages.push(i)
      }
      
      if (current < total - 2) {
         pages.push('...')
      }
      
      pages.push(total)
   }
   
   return pages
})

const loadPage = (page) => {
   emit('page-change', page)
}

const changePerPage = (event) => {
   const perPage = parseInt(event.target.value)
   emit('per-page-change', perPage)
}
</script>

<template>
   <div v-if="showPagination" class="mt-4 flex flex-col items-center gap-3">
      <div class="flex items-center justify-center gap-2">
         <button 
            :disabled="!pagination.hasPrevPage"
            :class="[
               'px-3 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed',
               pagination.currentPage === 1 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
            ]"
            @click="loadPage(pagination.currentPage - 1)"
         >
            ← Назад
         </button>

         <div class="hidden sm:flex items-center gap-1">
            <template v-for="page in visiblePages" :key="page">
               <span v-if="page === '...'" class="px-2 py-2 text-gray-400 text-sm">...</span>
               <button 
                  v-else
                  :class="[
                     'px-3 py-2 rounded-lg transition-colors text-sm cursor-pointer',
                     pagination.currentPage === page 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  ]"
                  @click="loadPage(page)"
               >
                  {{ page }}
               </button>
            </template>
         </div>

         <span class="sm:hidden text-sm text-gray-500 dark:text-gray-400">
            {{ pagination.currentPage }}/{{ pagination.lastPage }}
         </span>

         <button 
            :disabled="!pagination.hasNextPage"
            :class="[
               'px-3 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed',
               pagination.currentPage === pagination.lastPage
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
            ]"
            @click="loadPage(pagination.currentPage + 1)"
         >
            Вперёд →
         </button>
      </div>

      <div class="text-center text-sm text-gray-500 dark:text-gray-400">
         Страница {{ pagination.currentPage }} из {{ pagination.lastPage }} ({{ pagination.total }} записей)
      </div>

      <div class="flex items-center gap-2">
         <span class="text-xs text-gray-500 dark:text-gray-400">Показывать по:</span>
         <select 
            :value="pagination.perPage"
            @change="changePerPage"
            class="px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
         >
            <option v-for="option in perPageOptions" :key="option" :value="option">
               {{ option }}
            </option>
         </select>
      </div>
   </div>
</template>
