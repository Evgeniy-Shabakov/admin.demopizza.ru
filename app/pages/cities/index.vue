<script setup>
useHead({
  title: 'Города'
})

import { IconCheck, IconX, IconWarning } from '~/components/icons'

const router = useRouter()
const { cities, loading, fetchCities, deleteCity } = useCities()
const { fetchCountries, countries } = useCountries()
const { success: showSuccess } = useToast()
const showDeleteModal = ref(false)
const cityToDelete = ref(null)

onMounted(() => {
  fetchCities()
  fetchCountries()
})

const viewCity = (id) => {
  router.push(`/cities/${id}`)
}

const confirmDelete = (city) => {
  cityToDelete.value = city
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (cityToDelete.value) {
    const result = await deleteCity(cityToDelete.value.id)
    if (result) {
      showSuccess('Город успешно удалён')
    }
    showDeleteModal.value = false
    cityToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  cityToDelete.value = null
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
    viewCity(id)
  }
}

const getCountryName = (countryId) => {
  const country = countries.value.find(c => c.id === countryId)
  return country?.name || '—'
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
          <thead class="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Название</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Страна</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Карта</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Создано</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Обновлено</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky right-0">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="city in cities" 
              :key="city.id" 
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              @click="handleRowClick(city.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm select-text">{{ city.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap font-medium select-text">{{ city.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm select-text">{{ getCountryName(city.countryId) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center select-text">
                <span v-if="city.mapIframe" class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30">
                  <IconCheck class="w-4 h-4 text-green-600 dark:text-green-400" />
                </span>
                <span v-else class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700">
                  <IconX class="w-4 h-4 text-gray-400" />
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 select-text">{{ city.createdAt }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 select-text">{{ city.updatedAt }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm select-text sticky right-0 bg-white dark:bg-gray-800">
                <UiActionListButtons
                  :view-link="`/cities/${city.id}`"
                  :edit-link="`/cities/${city.id}/edit`"
                  @delete="confirmDelete(city)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        <div 
          v-for="city in cities" 
          :key="city.id" 
          class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <div class="p-4" @click="viewCity(city.id)">
            <div class="flex items-center gap-2 mb-1">
              <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ city.id }}</p>
              <span v-if="city.mapIframe" class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30">
                <IconCheck class="w-3 h-3 text-green-600 dark:text-green-400" />
              </span>
            </div>
            <p class="font-medium">{{ city.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ getCountryName(city.countryId) }}</p>
          </div>
          <div class="px-4 pb-4">
            <UiActionListButtons
              :view-link="`/cities/${city.id}`"
              :edit-link="`/cities/${city.id}/edit`"
              small
              @delete="confirmDelete(city)"
            />
          </div>
        </div>
        
        <div v-if="cities.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          Города не найдены
        </div>
      </div>
    </BaseCard>

    <BaseModal :show="showDeleteModal" @close="cancelDelete">
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30">
          <IconWarning class="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Удалить город
        </h3>

        <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
          Вы уверены, что хотите удалить <strong>{{ cityToDelete?.name }}</strong>? Это действие нельзя отменить.
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
