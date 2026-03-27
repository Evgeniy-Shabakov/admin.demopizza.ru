<script setup>
useHead({
  title: 'Страны'
})

const router = useRouter()
const { countries, loading, fetchCountries, deleteCountry } = useCountries()
const { success: showSuccess } = useToast()
const showDeleteModal = ref(false)
const countryToDelete = ref(null)

onMounted(() => {
  fetchCountries()
})

const viewCountry = (id) => {
  router.push(`/countries/${id}`)
}

const confirmDelete = (country) => {
  countryToDelete.value = country
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (countryToDelete.value) {
    await deleteCountry(countryToDelete.value.id)
    showSuccess('Страна успешно удалена')
    showDeleteModal.value = false
    countryToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  countryToDelete.value = null
}

let clickTimeout = null
let clickCount = 0

const handleRowClick = (id) => {
  clickCount++
  if (clickCount === 1) {
    clickTimeout = setTimeout(() => {
      clickCount = 0
    }, 300)
  } else if (clickCount === 2) {
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      clickTimeout = null
    }
    clickCount = 0
    viewCountry(id)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Название</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Создано</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Обновлено</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="country in countries" 
              :key="country.id" 
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              @click="handleRowClick(country.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm select-text">{{ country.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap font-medium select-text">{{ country.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 select-text">{{ country.createdAt }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 select-text">{{ country.updatedAt }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm select-text" @click.stop>
                <div class="flex items-center justify-end gap-2">
                  <button @click="viewCountry(country.id)" class="px-3 py-1.5 text-sm bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer">
                    Просмотр
                  </button>
                  <NuxtLink :to="`/countries/${country.id}/edit`" class="px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer">
                    Редакт.
                  </NuxtLink>
                  <button @click="confirmDelete(country)" class="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 cursor-pointer">
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        <div 
          v-for="country in countries" 
          :key="country.id" 
          class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <div class="p-4" @click="viewCountry(country.id)">
            <div class="flex items-center justify-between mb-2">
              <div>
                <p class="font-medium">{{ country.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">ID: {{ country.id }}</p>
              </div>
            </div>
            <p class="text-xs text-gray-400 dark:text-gray-500 mb-3">Обновлено: {{ country.updatedAt }}</p>
          </div>
          <div class="px-4 pb-4 flex gap-2" @click.stop>
            <NuxtLink :to="`/countries/${country.id}`" class="flex-1 px-3 py-2 text-center text-sm bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer">
              Просмотр
            </NuxtLink>
            <NuxtLink :to="`/countries/${country.id}/edit`" class="flex-1 px-3 py-2 text-center text-sm bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer">
              Редакт.
            </NuxtLink>
            <button @click="confirmDelete(country)" class="flex-1 px-3 py-2 text-center text-sm bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 cursor-pointer">
              Удалить
            </button>
          </div>
        </div>
        
        <div v-if="countries.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          Страны не найдены
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="cancelDelete">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50 transition-opacity" @click="cancelDelete"></div>
          <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
            <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/50 rounded-full">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-center mb-2">Удалить страну</h3>
            <p class="text-gray-500 dark:text-gray-400 text-center mb-6">
              Вы уверены, что хотите удалить <strong>{{ countryToDelete?.name }}</strong>? Это действие нельзя отменить.
            </p>
            <div class="flex gap-3">
              <button @click="cancelDelete" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
                Отмена
              </button>
              <button @click="handleDelete" class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer">
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
