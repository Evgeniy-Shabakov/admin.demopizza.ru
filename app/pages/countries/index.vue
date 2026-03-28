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
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm select-text">
                <UiActionListButtons
                  :view-link="`/countries/${country.id}`"
                  :edit-link="`/countries/${country.id}/edit`"
                  
                  @delete="confirmDelete(country)"
                />
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
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">ID: {{ country.id }}</p>
            <p class="font-medium">{{ country.name }}</p>
          </div>
          <div class="px-4 pb-4">
            <UiActionListButtons
              :view-link="`/countries/${country.id}`"
              :edit-link="`/countries/${country.id}/edit`"
              
              small
              @delete="confirmDelete(country)"
            />
          </div>
        </div>
        
        <div v-if="countries.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          Страны не найдены
        </div>
      </div>
    </div>

    <UiConfirmModal
      :show="showDeleteModal"
      title="Удалить страну"
      confirm-text="Удалить"
      type="danger"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    >
      Вы уверены, что хотите удалить <strong>{{ countryToDelete?.name }}</strong>? Это действие нельзя отменить.
    </UiConfirmModal>
  </div>
</template>
