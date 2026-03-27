<script setup>
useHead({
  title: 'Редактирование страны'
})

const route = useRoute()
const router = useRouter()
const countryId = route.params.id
const { getCountry, updateCountry, loading } = useCountries()

const form = ref({
  name: ''
})

const country = ref(null)

onMounted(async () => {
  country.value = await getCountry(Number(countryId))
  if (country.value) {
    form.value.name = country.value.name
  }
})

const saveCountry = async () => {
  const success = await updateCountry(Number(countryId), form.value.name)
  if (success) {
    router.push(`/countries/${countryId}`)
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <form @submit.prevent="saveCountry" class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-2">Название страны *</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div class="flex gap-4 pt-4">
          <button 
            type="submit" 
            :disabled="loading"
            class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors"
          >
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
          <NuxtLink :to="`/countries/${countryId}`" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
