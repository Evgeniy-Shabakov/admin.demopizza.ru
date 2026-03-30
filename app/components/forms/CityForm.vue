<script setup>
defineProps({
  city: Object,
  disabled: Boolean,
  showDetails: Boolean,
  countries: Array,
  validationError: String
})

const form = defineModel({
  default: () => ({
    name: '',
    countryId: null,
    mapIframe: ''
  })
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="showDetails && city">
      <BaseLabel for="city-id">ID</BaseLabel>
      <BaseInput
        id="city-id"
        :model-value="city?.id"
        type="text"
        disabled
      />
    </div>

    <div>
      <BaseLabel for="city-name" required>Название города</BaseLabel>
      <BaseInput
        v-if="disabled && city"
        id="city-name"
        :model-value="city.name"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="city-name"
        v-model="form.name"
        type="text"
        :disabled="disabled"
        required
        minlength="2"
        maxlength="100"
        placeholder="Введите название города"
      />
    </div>

    <div>
      <BaseLabel for="city-country" required>Страна</BaseLabel>
      <div class="w-full">
        <select
          v-if="disabled && city"
          id="city-country"
          :value="city.countryId"
          disabled
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        >
          <option v-for="country in countries" :key="country.id" :value="country.id">
            {{ country.name }}
          </option>
        </select>
        <select
          v-else
          id="city-country"
          v-model="form.countryId"
          :disabled="disabled"
          required
          :class="[
            'w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            !form.countryId && validationError 
              ? 'border-red-500 dark:border-red-400' 
              : 'border-gray-300 dark:border-gray-600'
          ]"
        >
          <option :value="null" disabled>Выберите страну</option>
          <option v-for="country in countries" :key="country.id" :value="country.id">
            {{ country.name }}
          </option>
        </select>
        <p v-if="!form.countryId && validationError" class="mt-1 text-sm text-red-600 dark:text-red-400">
          Выберите страну
        </p>
      </div>
    </div>

    <div>
      <BaseLabel for="city-map">Iframe код карты</BaseLabel>
      <p class="mt-1 mb-2 text-sm text-gray-500 dark:text-gray-400">
        Карта создаётся с помощью <a href="https://yandex.ru/map-constructor" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:underline">конструктора Яндекс Карт</a>
      </p>
      <BaseTextarea
        v-if="disabled && city"
        id="city-map"
        :model-value="city.mapIframe"
        type="text"
        disabled
        :rows="4"
      />
      <BaseTextarea
        v-else
        id="city-map"
        v-model="form.mapIframe"
        type="text"
        :disabled="disabled"
        placeholder='<iframe src="..."></iframe>'
        :rows="4"
      />
    </div>

    <div v-if="showDetails && city">
      <BaseLabel for="city-created">Создано</BaseLabel>
      <BaseInput
        id="city-created"
        :model-value="city.createdAt"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && city">
      <BaseLabel for="city-updated">Обновлено</BaseLabel>
      <BaseInput
        id="city-updated"
        :model-value="city.updatedAt"
        type="text"
        disabled
      />
    </div>

    <p v-if="validationError && form.countryId" class="text-sm text-red-500 -mb-6">
      {{ validationError }}
    </p>
  </div>
</template>
