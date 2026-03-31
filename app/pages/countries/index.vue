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
    const result = await deleteCountry(countryToDelete.value.id)
    if (result) {
      showSuccess('Страна успешно удалена')
    }
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

    <BaseCard v-else padding="none">
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
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
    </BaseCard>

    <BaseModal :show="showDeleteModal" @close="cancelDelete">
      <div class="text-center">
        <div :class="[
          'w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center',
          'bg-red-100 dark:bg-red-900/30'
        ]">
          <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Удалить страну
        </h3>

        <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
          Вы уверены, что хотите удалить <strong>{{ countryToDelete?.name }}</strong>? Это действие нельзя отменить.
        </p>
      </div>

      <div class="flex gap-3">
        <BaseButton variant="secondary" class="flex-1" @click="cancelDelete">
          Отмена
        </BaseButton>
        <BaseButton variant="danger" class="flex-1" :loading="loading" @click="handleDelete">
          Удалить
        </BaseButton>
      </div>
    </BaseModal>
  </div>
</template>
