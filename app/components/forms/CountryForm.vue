<script setup>
defineProps({
  country: Object,
  disabled: Boolean,
  showDetails: Boolean,
  validationError: String
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
      <BaseLabel for="country-id">ID</BaseLabel>
      <BaseInput
        id="country-id"
        :model-value="country?.id"
        type="text"
        disabled
      />
    </div>

    <div>
      <BaseLabel for="country-name" required>Название страны</BaseLabel>
      <BaseInput
        v-if="disabled && country"
        id="country-name"
        :model-value="country.name"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="country-name"
        v-model="form.name"
        type="text"
        :disabled="disabled"
        required
        minlength="2"
        maxlength="100"
        placeholder="Введите название страны"
        :error="validationError"
      />
    </div>

    <div v-if="showDetails && country">
      <BaseLabel for="country-created">Создано</BaseLabel>
      <BaseInput
        id="country-created"
        :model-value="country.createdAt"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && country">
      <BaseLabel for="country-updated">Обновлено</BaseLabel>
      <BaseInput
        id="country-updated"
        :model-value="country.updatedAt"
        type="text"
        disabled
      />
    </div>
  </div>
</template>
