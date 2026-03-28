<script setup>
useHead({
  title: 'Добавить страну'
})

const { createCountry, loading } = useCountries()
const { success: showSuccess } = useToast()

const form = ref({
  name: ''
})

const saveCountry = async (navigateToList = false) => {
  const isCreated = await createCountry(form.value.name)
  if (isCreated) {
    showSuccess('Страна успешно добавлена')
    if (navigateToList) {
      navigateTo('/countries')
    } else {
      form.value.name = ''
    }
  }
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <form @submit.prevent="saveCountry(true)" class="space-y-6">
        <FormsCountryForm v-model="form" />

        <div class="flex flex-wrap gap-4 pt-4">
          <button 
            type="submit" 
            :disabled="loading"
            class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors cursor-pointer"
          >
            {{ loading ? 'Сохранение...' : 'Добавить' }}
          </button>
          <button 
            type="button"
            @click="saveCountry(false)"
            :disabled="loading"
            class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors cursor-pointer"
          >
            {{ loading ? 'Сохранение...' : 'Добавить и добавить еще' }}
          </button>
           <NuxtLink to="/countries" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer">
            Отмена
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
