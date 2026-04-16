<script setup>
defineProps({
  design: Object,
  disabled: Boolean,
  showDetails: Boolean,
  validationError: String
})

const form = defineModel({
  default: () => ({
    name: '',
    isActive: false,
    backgroundPageMainColor: '#f3f4f6',
    backgroundPageElementsColor: '#ffffff',
    brandColor: '#ff6b35',
    textColorMain: '#000000',
    textColorOnBrandColor: '#ffffff',
    textColorAccent: '#008000',
    bottomNavColor: '#a6a6a6'
  })
})

const colorFields = [
  { key: 'backgroundPageMainColor', label: 'Цвет фона страницы', placeholder: '#f3f4f6' },
  { key: 'backgroundPageElementsColor', label: 'Цвет фона элементов', placeholder: '#ffffff' },
  { key: 'brandColor', label: 'Брендовый цвет', placeholder: '#ff6b35' },
  { key: 'textColorMain', label: 'Основной цвет текста', placeholder: '#000000' },
  { key: 'textColorOnBrandColor', label: 'Цвет текста на брендовом', placeholder: '#ffffff' },
  { key: 'textColorAccent', label: 'Акцентный цвет текста', placeholder: '#008000' },
  { key: 'bottomNavColor', label: 'Цвет нижней навигации', placeholder: '#a6a6a6' }
]
</script>

<template>
  <div class="space-y-6">
    <div v-if="showDetails && design">
      <BaseLabel for="design-id">ID</BaseLabel>
      <BaseInput
        id="design-id"
        :model-value="design?.id"
        type="text"
        disabled
      />
    </div>

    <div>
      <BaseLabel for="design-name" required>Название</BaseLabel>
      <BaseInput
        v-if="disabled && design"
        id="design-name"
        :model-value="design.name"
        type="text"
        disabled
      />
      <BaseInput
        v-else
        id="design-name"
        v-model="form.name"
        type="text"
        :disabled="disabled"
        required
        minlength="2"
        maxlength="100"
        placeholder="Введите название дизайна"
      />
    </div>

    <div v-for="field in colorFields" :key="field.key">
      <BaseLabel :for="`design-${field.key}`">{{ field.label }}</BaseLabel>
      <div class="flex gap-4 items-center">
        <input
          v-if="!disabled"
          type="color"
          :id="`design-${field.key}`"
          v-model="form[field.key]"
          class="h-10 w-20 rounded cursor-pointer"
        />
        <div
          v-else
          class="h-10 w-20 rounded border"
          :style="{ backgroundColor: design?.settings?.[field.key] || field.placeholder }"
        ></div>
        <BaseInput
          v-if="disabled && design"
          :model-value="design.settings?.[field.key]"
          type="text"
          disabled
          class="flex-1"
        />
        <BaseInput
          v-else
          v-model="form[field.key]"
          type="text"
          :disabled="disabled"
          :placeholder="field.placeholder"
          class="flex-1"
        />
      </div>
    </div>

    <div class="flex items-center gap-3">
      <BaseCheckbox
        :model-value="disabled && design ? design.isActive : form.isActive"
        :disabled="disabled"
        @update:model-value="form.isActive = $event"
      />
      <span class="text-sm text-gray-700 dark:text-gray-300">Активен</span>
    </div>

    <div v-if="showDetails && design">
      <BaseLabel for="design-created">Создано</BaseLabel>
      <BaseInput
        id="design-created"
        :model-value="design.createdAt"
        type="text"
        disabled
      />
    </div>

    <div v-if="showDetails && design">
      <BaseLabel for="design-updated">Обновлено</BaseLabel>
      <BaseInput
        id="design-updated"
        :model-value="design.updatedAt"
        type="text"
        disabled
      />
    </div>

    <p v-if="validationError" class="text-sm text-red-500 -mb-6">
      {{ validationError }}
    </p>
  </div>
</template>