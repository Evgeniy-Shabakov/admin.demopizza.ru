<script setup>
defineProps({
  category: Object,
  disabled: Boolean,
  showDetails: Boolean,
  validationError: String
})

const form = defineModel({
  default: () => ({
    name: '',
    position: null
  })
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="showDetails && category">
      <BaseLabel for="category-id">ID</BaseLabel>
      <BaseInput
        id="category-id"
        :model-value="category?.id"
        type="text"
        disabled
      />
    </div>

    <div>
      <BaseLabel for="category-name" required>Название</BaseLabel>
      <BaseInput
        v-if="disabled && category"
        id="category-name"
        :model-value="category.name"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="category-name"
        v-model="form.name"
        type="text"
        :disabled="disabled"
        required
        minlength="2"
        maxlength="100"
        placeholder="Введите название категории"
      />
    </div>

    <div>
      <BaseLabel for="category-position">Позиция</BaseLabel>
      <BaseInput
        v-if="disabled && category"
        id="category-position"
        :model-value="category.position"
        type="number"
        disabled
      />
      <BaseInput
        v-else
        id="category-position"
        v-model="form.position"
        type="number"
        :disabled="disabled"
        placeholder="0"
      />
    </div>

    <div v-if="showDetails && category">
      <BaseLabel for="category-created">Создано</BaseLabel>
      <BaseInput
        id="category-created"
        :model-value="category.createdAt"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && category">
      <BaseLabel for="category-updated">Обновлено</BaseLabel>
      <BaseInput
        id="category-updated"
        :model-value="category.updatedAt"
        type="text"
        disabled
      />
    </div>

    <p v-if="validationError" class="text-sm text-red-500 -mb-6">
      {{ validationError }}
    </p>
  </div>
</template>
