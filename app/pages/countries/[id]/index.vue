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
      <form class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-2">ID</label>
          <input
            :value="country.id"
            type="text"
            disabled
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Название страны</label>
          <input
            :value="country.name"
            type="text"
            disabled
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Создано</label>
          <input
            :value="country.createdAt"
            type="text"
            disabled
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Обновлено</label>
          <input
            :value="country.updatedAt"
            type="text"
            disabled
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          />
        </div>
      </form>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
      <p class="text-gray-500 dark:text-gray-400">Страна не найдена</p>
    </div>
  </div>
</template>
