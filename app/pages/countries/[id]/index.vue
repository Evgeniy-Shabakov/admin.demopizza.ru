<script setup>
useHead({
  title: 'Просмотр страны'
})

const route = useRoute()
const countryId = route.params.id
const { getCountry, loading } = useCountries()

const country = ref(null)

onMounted(async () => {
  country.value = await getCountry(Number(countryId))
})
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="country" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="space-y-4">
        <div class="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-500 dark:text-gray-400">ID</span>
          <span class="font-medium">{{ country.id }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-500 dark:text-gray-400">Название</span>
          <span class="font-medium">{{ country.name }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-500 dark:text-gray-400">Создано</span>
          <span class="font-medium">{{ country.createdAt }}</span>
        </div>
        <div class="flex justify-between py-3">
          <span class="text-gray-500 dark:text-gray-400">Обновлено</span>
          <span class="font-medium">{{ country.updatedAt }}</span>
        </div>
      </div>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
      <p class="text-gray-500 dark:text-gray-400">Страна не найдена</p>
    </div>
  </div>
</template>
