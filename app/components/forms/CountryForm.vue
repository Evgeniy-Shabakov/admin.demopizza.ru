<script setup>
defineProps({
  country: Object,
  disabled: Boolean,
  showDetails: Boolean
})

const form = defineModel({
  default: () => ({
    name: ''
  })
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="showDetails && country">
      <label class="block text-sm font-medium mb-2">ID</label>
      <input
        :value="country?.id"
        type="text"
        disabled
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Название страны *</label>
      <input
        v-if="disabled && country"
        :value="country.name"
        type="text"
        disabled
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
      />
      <input
        v-else
        v-model="form.name"
        type="text"
        :disabled="disabled"
        required
        placeholder="Введите название страны"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>

    <div v-if="showDetails && country">
      <label class="block text-sm font-medium mb-2">Создано</label>
      <input
        :value="country.createdAt"
        type="text"
        disabled
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
      />
    </div>

    <div v-if="showDetails && country">
      <label class="block text-sm font-medium mb-2">Обновлено</label>
      <input
        :value="country.updatedAt"
        type="text"
        disabled
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
      />
    </div>
  </div>
</template>
