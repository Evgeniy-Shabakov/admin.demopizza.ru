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
                  <button @click="viewCountry(country.id)" class="p-2 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer" title="Просмотр">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <NuxtLink :to="`/countries/${country.id}/edit`" class="p-2 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer" title="Редактировать">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </NuxtLink>
                  <button @click="confirmDelete(country)" class="p-2 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 cursor-pointer" title="Удалить">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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
            <NuxtLink :to="`/countries/${country.id}`" class="p-2 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer" title="Просмотр">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </NuxtLink>
            <NuxtLink :to="`/countries/${country.id}/edit`" class="p-2 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer" title="Редактировать">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </NuxtLink>
            <button @click="confirmDelete(country)" class="p-2 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 cursor-pointer" title="Удалить">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div v-if="countries.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          Страны не найдены
        </div>
      </div>
    </div>

    <FormsConfirmModal
      :show="showDeleteModal"
      title="Удалить страну"
      confirm-text="Удалить"
      type="danger"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    >
      Вы уверены, что хотите удалить <strong>{{ countryToDelete?.name }}</strong>? Это действие нельзя отменить.
    </FormsConfirmModal>
  </div>
</template>
